const express = require('express');
const OpenAI = require('openai');
const { body, validationResult } = require('express-validator');
const { auth, optionalAuth } = require('../middleware/auth');
const Itinerary = require('../models/Itinerary');
const User = require('../models/User');

const router = express.Router();

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// @desc    Generate AI itinerary
// @route   POST /api/ai/generate-itinerary
// @access  Private
router.post('/generate-itinerary', auth, [
  body('destination')
    .notEmpty()
    .withMessage('Destination is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Destination must be between 2 and 100 characters'),
  body('days')
    .isInt({ min: 1, max: 30 })
    .withMessage('Days must be between 1 and 30'),
  body('budget')
    .optional()
    .isNumeric()
    .withMessage('Budget must be a number'),
  body('interests')
    .optional()
    .isArray()
    .withMessage('Interests must be an array'),
  body('travelStyle')
    .optional()
    .isIn(['budget', 'mid-range', 'luxury', 'backpacker', 'family'])
    .withMessage('Invalid travel style')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const {
      destination,
      days,
      budget,
      interests = [],
      travelStyle = 'mid-range',
      groupSize = 2,
      season = 'any',
      specialRequests
    } = req.body;

    // Create AI prompt
    const interestsText = interests.length > 0 ? interests.join(', ') : 'general sightseeing';
    const budgetText = budget ? `with a budget of $${budget}` : 'with a moderate budget';
    
    const prompt = `Create a detailed ${days}-day travel itinerary for ${destination} ${budgetText}. 
    
Travel details:
- Style: ${travelStyle} 
- Group size: ${groupSize} people
- Interests: ${interestsText}
- Season: ${season}
${specialRequests ? `- Special requests: ${specialRequests}` : ''}

Please provide a comprehensive itinerary in the following JSON format:
{
  "title": "Trip title",
  "description": "Brief trip description",
  "destination": {
    "name": "City, Country",
    "country": "Country name",
    "coordinates": {"latitude": 0, "longitude": 0}
  },
  "duration": {"days": ${days}, "nights": ${days - 1}},
  "budget": {
    "total": estimated_total_budget,
    "currency": "USD",
    "breakdown": {
      "accommodation": amount,
      "food": amount,
      "activities": amount,
      "transportation": amount
    }
  },
  "activities": [
    {
      "day": 1,
      "time": "09:00",
      "title": "Activity name",
      "description": "Detailed description",
      "location": {
        "name": "Location name",
        "address": "Full address",
        "coordinates": {"latitude": 0, "longitude": 0}
      },
      "duration": "2 hours",
      "cost": {"amount": 0, "currency": "USD"},
      "category": "sightseeing",
      "tips": ["Helpful tip 1", "Helpful tip 2"]
    }
  ],
  "accommodation": {
    "name": "Hotel/accommodation name",
    "type": "hotel",
    "address": "Full address",
    "cost": estimated_cost_per_night,
    "amenities": ["WiFi", "Breakfast", "Pool"]
  },
  "transportation": {
    "arrival": {"type": "flight", "details": "Flight recommendations", "cost": 0},
    "local": {"primary": "public", "details": "Local transport info", "estimatedCost": 0}
  },
  "tips": ["General travel tip 1", "General travel tip 2"],
  "bestTimeToVisit": "Season/months",
  "packingList": ["Item 1", "Item 2"]
}

Make sure to:
1. Include 3-5 activities per day
2. Provide realistic costs in USD
3. Include actual coordinates when possible
4. Add practical tips and advice
5. Consider the specified interests and travel style
6. Include meal recommendations
7. Suggest local transportation options`;

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an expert travel planner with extensive knowledge of destinations worldwide. Provide detailed, practical, and culturally sensitive travel itineraries in valid JSON format."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 3000,
      temperature: 0.7,
    });

    let aiResponse = completion.choices[0].message.content;
    
    // Clean up the response to extract JSON
    const jsonStart = aiResponse.indexOf('{');
    const jsonEnd = aiResponse.lastIndexOf('}') + 1;
    
    if (jsonStart !== -1 && jsonEnd !== -1) {
      aiResponse = aiResponse.substring(jsonStart, jsonEnd);
    }

    let itineraryData;
    try {
      itineraryData = JSON.parse(aiResponse);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      return res.status(500).json({
        success: false,
        message: 'Error parsing AI response. Please try again.'
      });
    }

    // Enhance the itinerary data with user information
    const enhancedItinerary = {
      ...itineraryData,
      createdBy: req.user._id,
      isAIGenerated: true,
      aiPrompt: prompt,
      status: 'draft',
      dateRange: {
        startDate: new Date(),
        endDate: new Date(Date.now() + (days * 24 * 60 * 60 * 1000))
      }
    };

    res.json({
      success: true,
      message: 'Itinerary generated successfully',
      data: {
        itinerary: enhancedItinerary,
        usage: {
          promptTokens: completion.usage.prompt_tokens,
          completionTokens: completion.usage.completion_tokens,
          totalTokens: completion.usage.total_tokens
        }
      }
    });

  } catch (error) {
    console.error('AI Generate Itinerary Error:', error);
    
    if (error.code === 'insufficient_quota') {
      return res.status(402).json({
        success: false,
        message: 'AI service quota exceeded. Please try again later.'
      });
    }
    
    if (error.code === 'rate_limit_exceeded') {
      return res.status(429).json({
        success: false,
        message: 'Too many requests. Please wait a moment before trying again.'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error generating itinerary. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @desc    Get travel recommendations
// @route   POST /api/ai/recommendations
// @access  Public (with optional auth for personalization)
router.post('/recommendations', optionalAuth, [
  body('location')
    .notEmpty()
    .withMessage('Location is required'),
  body('type')
    .isIn(['restaurants', 'attractions', 'activities', 'accommodations', 'general'])
    .withMessage('Invalid recommendation type')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const { location, type, preferences = {} } = req.body;
    
    // Get user preferences if authenticated
    let userPreferences = {};
    if (req.user) {
      userPreferences = req.user.preferences || {};
    }

    const combinedPreferences = { ...userPreferences, ...preferences };

    const prompt = `Provide ${type} recommendations for ${location}. 
    
${combinedPreferences.interests ? `User interests: ${combinedPreferences.interests.join(', ')}` : ''}
${combinedPreferences.budget ? `Budget range: $${combinedPreferences.budget.min}-$${combinedPreferences.budget.max}` : ''}
${combinedPreferences.travelStyle ? `Travel style: ${combinedPreferences.travelStyle}` : ''}

Please provide 5-8 specific recommendations in JSON format:
{
  "recommendations": [
    {
      "name": "Place name",
      "type": "${type}",
      "description": "Detailed description",
      "location": {
        "address": "Full address",
        "coordinates": {"latitude": 0, "longitude": 0}
      },
      "rating": 4.5,
      "priceRange": "$ | $$ | $$$ | $$$$",
      "highlights": ["Feature 1", "Feature 2"],
      "tips": ["Tip 1", "Tip 2"],
      "openHours": "Operating hours if applicable",
      "website": "website if known",
      "bestTimeToVisit": "Time recommendation"
    }
  ]
}

Focus on highly-rated, authentic local experiences and hidden gems.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a local travel expert with deep knowledge of destinations worldwide. Provide authentic, current recommendations with practical details."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 2000,
      temperature: 0.8,
    });

    let aiResponse = completion.choices[0].message.content;
    
    // Extract JSON from response
    const jsonStart = aiResponse.indexOf('{');
    const jsonEnd = aiResponse.lastIndexOf('}') + 1;
    
    if (jsonStart !== -1 && jsonEnd !== -1) {
      aiResponse = aiResponse.substring(jsonStart, jsonEnd);
    }

    const recommendationsData = JSON.parse(aiResponse);

    res.json({
      success: true,
      message: 'Recommendations generated successfully',
      data: {
        location,
        type,
        ...recommendationsData,
        generatedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('AI Recommendations Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating recommendations. Please try again.'
    });
  }
});

// @desc    Chat with AI travel assistant
// @route   POST /api/ai/chat
// @access  Public (with optional auth)
router.post('/chat', optionalAuth, [
  body('message')
    .notEmpty()
    .withMessage('Message is required')
    .isLength({ min: 1, max: 1000 })
    .withMessage('Message must be between 1 and 1000 characters'),
  body('context')
    .optional()
    .isObject()
    .withMessage('Context must be an object')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const { message, context = {} } = req.body;
    
    // Build context for AI
    let contextPrompt = "You are TravelSensei, a friendly and knowledgeable AI travel assistant. ";
    
    if (req.user) {
      contextPrompt += `The user's name is ${req.user.name}. `;
      if (req.user.preferences) {
        contextPrompt += `User preferences: ${JSON.stringify(req.user.preferences)}. `;
      }
    }
    
    if (context.destination) {
      contextPrompt += `Current destination context: ${context.destination}. `;
    }
    
    contextPrompt += `Provide helpful, accurate, and engaging travel advice. Keep responses conversational and practical.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: contextPrompt
        },
        {
          role: "user",
          content: message
        }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const aiResponse = completion.choices[0].message.content;

    res.json({
      success: true,
      data: {
        response: aiResponse,
        timestamp: new Date().toISOString(),
        usage: {
          promptTokens: completion.usage.prompt_tokens,
          completionTokens: completion.usage.completion_tokens,
          totalTokens: completion.usage.total_tokens
        }
      }
    });

  } catch (error) {
    console.error('AI Chat Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing chat message. Please try again.'
    });
  }
});

module.exports = router;