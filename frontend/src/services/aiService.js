/**
 * AI Service for generating travel itineraries
 * This service simulates AI-powered itinerary generation
 * In a real implementation, this would connect to services like OpenAI, Google's Gemini, or custom ML models
 */

import axios from 'axios';

/**
 * @typedef {Object} ItineraryRequest
 * @property {string} destination - Primary destination
 * @property {number} duration - Trip duration in days
 * @property {number} budget - Budget in USD
 * @property {string[]} interests - User interests and preferences
 * @property {string} travelStyle - Travel style (adventure, luxury, budget, etc.)
 * @property {string} groupSize - Group size (solo, couple, family, group)
 * @property {Object} dates - Travel dates
 * @property {string} dates.startDate - Start date in ISO format
 * @property {string} dates.endDate - End date in ISO format
 */

/**
 * @typedef {Object} Activity
 * @property {string} id - Unique activity ID
 * @property {string} name - Activity name
 * @property {string} description - Activity description
 * @property {string} category - Activity category
 * @property {number} duration - Duration in hours
 * @property {number} cost - Estimated cost
 * @property {Object} location - Location details
 * @property {number} location.lat - Latitude
 * @property {number} location.lng - Longitude
 * @property {string} location.address - Full address
 * @property {number} rating - Rating (1-5)
 * @property {string[]} images - Array of image URLs
 * @property {string[]} tags - Activity tags
 */

/**
 * @typedef {Object} DayItinerary
 * @property {number} day - Day number
 * @property {string} date - Date in ISO format
 * @property {string} theme - Day theme
 * @property {Activity[]} activities - Activities for the day
 * @property {Object} transportation - Transportation details
 * @property {number} estimatedCost - Estimated cost for the day
 */

/**
 * @typedef {Object} GeneratedItinerary
 * @property {string} id - Itinerary ID
 * @property {string} title - Itinerary title
 * @property {string} description - Itinerary description
 * @property {string} destination - Primary destination
 * @property {number} duration - Duration in days
 * @property {number} totalBudget - Total estimated budget
 * @property {DayItinerary[]} days - Daily itineraries
 * @property {Object} metadata - Additional metadata
 * @property {string} createdAt - Creation timestamp
 */

// Mock data for destinations and activities
const MOCK_DESTINATIONS = {
  'tokyo': {
    activities: [
      {
        id: 'tokyo-1',
        name: 'Visit Senso-ji Temple',
        description: 'Explore Tokyo\'s oldest temple in historic Asakusa district',
        category: 'Cultural',
        duration: 2,
        cost: 0,
        location: { lat: 35.7148, lng: 139.7967, address: '2-3-1 Asakusa, Taito City, Tokyo' },
        rating: 4.6,
        images: ['/images/sensoji.jpg'],
        tags: ['temple', 'historical', 'free']
      },
      {
        id: 'tokyo-2',
        name: 'Tsukiji Outer Market Food Tour',
        description: 'Experience the world\'s largest fish market and sample fresh sushi',
        category: 'Food',
        duration: 3,
        cost: 45,
        location: { lat: 35.6654, lng: 139.7707, address: 'Tsukiji, Chuo City, Tokyo' },
        rating: 4.8,
        images: ['/images/tsukiji.jpg'],
        tags: ['food', 'market', 'sushi']
      },
      {
        id: 'tokyo-3',
        name: 'Shibuya Crossing & Hachiko Statue',
        description: 'Experience the world\'s busiest pedestrian crossing',
        category: 'Sightseeing',
        duration: 1,
        cost: 0,
        location: { lat: 35.6598, lng: 139.7006, address: 'Shibuya City, Tokyo' },
        rating: 4.4,
        images: ['/images/shibuya.jpg'],
        tags: ['iconic', 'urban', 'free']
      },
      {
        id: 'tokyo-4',
        name: 'TeamLab Borderless',
        description: 'Immersive digital art experience',
        category: 'Art & Culture',
        duration: 4,
        cost: 32,
        location: { lat: 35.6249, lng: 139.7798, address: 'Odaiba, Tokyo' },
        rating: 4.7,
        images: ['/images/teamlab.jpg'],
        tags: ['art', 'digital', 'unique']
      },
      {
        id: 'tokyo-5',
        name: 'Mount Fuji Day Trip',
        description: 'Full-day excursion to Japan\'s iconic mountain',
        category: 'Nature',
        duration: 10,
        cost: 120,
        location: { lat: 35.3606, lng: 138.7274, address: 'Mount Fuji, Japan' },
        rating: 4.9,
        images: ['/images/fuji.jpg'],
        tags: ['mountain', 'nature', 'day-trip']
      }
    ]
  },
  'paris': {
    activities: [
      {
        id: 'paris-1',
        name: 'Eiffel Tower Visit',
        description: 'Iconic iron tower and symbol of Paris',
        category: 'Sightseeing',
        duration: 3,
        cost: 29,
        location: { lat: 48.8584, lng: 2.2945, address: 'Champ de Mars, 5 Avenue Anatole France, 75007 Paris' },
        rating: 4.5,
        images: ['/images/eiffel.jpg'],
        tags: ['iconic', 'tower', 'views']
      },
      {
        id: 'paris-2',
        name: 'Louvre Museum',
        description: 'World\'s largest art museum and historic monument',
        category: 'Art & Culture',
        duration: 4,
        cost: 22,
        location: { lat: 48.8606, lng: 2.3376, address: 'Rue de Rivoli, 75001 Paris' },
        rating: 4.6,
        images: ['/images/louvre.jpg'],
        tags: ['museum', 'art', 'mona-lisa']
      },
      {
        id: 'paris-3',
        name: 'Seine River Cruise',
        description: 'Romantic cruise along the Seine with city views',
        category: 'Sightseeing',
        duration: 2,
        cost: 35,
        location: { lat: 48.8566, lng: 2.3522, address: 'Port de la Bourdonnais, Paris' },
        rating: 4.3,
        images: ['/images/seine.jpg'],
        tags: ['river', 'romantic', 'cruise']
      }
    ]
  },
  'bali': {
    activities: [
      {
        id: 'bali-1',
        name: 'Uluwatu Temple Sunset',
        description: 'Clifftop temple with spectacular sunset views',
        category: 'Cultural',
        duration: 3,
        cost: 5,
        location: { lat: -8.8297, lng: 115.0845, address: 'Pecatu, South Kuta, Badung Regency, Bali' },
        rating: 4.7,
        images: ['/images/uluwatu.jpg'],
        tags: ['temple', 'sunset', 'cliff']
      },
      {
        id: 'bali-2',
        name: 'Rice Terrace Trek',
        description: 'Guided trek through UNESCO World Heritage rice terraces',
        category: 'Nature',
        duration: 4,
        cost: 40,
        location: { lat: -8.3675, lng: 115.2189, address: 'Tegallalang, Gianyar Regency, Bali' },
        rating: 4.8,
        images: ['/images/rice-terrace.jpg'],
        tags: ['nature', 'trek', 'unesco']
      }
    ]
  }
};

class AIService {
  constructor() {
    // In a real implementation, this would contain API keys and configuration
    this.apiKey = process.env.REACT_APP_OPENAI_API_KEY || 'mock-key';
    this.baseURL = process.env.REACT_APP_AI_SERVICE_URL || 'mock-service';
  }

  /**
   * Generate a travel itinerary based on user preferences
   * @param {ItineraryRequest} request - User preferences and requirements
   * @returns {Promise<GeneratedItinerary>} Generated itinerary
   */
  async generateItinerary(request) {
    try {
      // Simulate API delay
      await this.delay(2000);

      // In a real implementation, this would call an AI service
      // For now, we'll generate a mock itinerary based on the request
      return this.generateMockItinerary(request);
    } catch (error) {
      console.error('Error generating itinerary:', error);
      throw new Error('Failed to generate itinerary. Please try again.');
    }
  }

  /**
   * Generate a mock itinerary for demonstration
   * @param {ItineraryRequest} request 
   * @returns {GeneratedItinerary}
   */
  generateMockItinerary(request) {
    const { destination, duration, budget, interests, travelStyle } = request;
    const destinationKey = destination.toLowerCase().replace(/[^a-z]/g, '');
    const destinationData = MOCK_DESTINATIONS[destinationKey] || MOCK_DESTINATIONS.tokyo;

    // Create daily itineraries
    const days = [];
    let totalCost = 0;

    for (let day = 1; day <= duration; day++) {
      const dayActivities = this.selectActivitiesForDay(
        destinationData.activities,
        interests,
        travelStyle,
        budget / duration,
        day
      );

      const dayItinerary = {
        day,
        date: this.getDateForDay(request.dates?.startDate, day - 1),
        theme: this.getDayTheme(day, travelStyle),
        activities: dayActivities,
        transportation: {
          type: day === 1 ? 'Airport Transfer' : 'Local Transport',
          cost: day === 1 ? 50 : 15
        },
        estimatedCost: dayActivities.reduce((sum, activity) => sum + activity.cost, 0) + (day === 1 ? 50 : 15)
      };

      totalCost += dayItinerary.estimatedCost;
      days.push(dayItinerary);
    }

    return {
      id: `itinerary-${Date.now()}`,
      title: `${duration}-Day ${this.capitalize(destination)} Adventure`,
      description: `A carefully crafted ${duration}-day itinerary for ${destination} featuring ${travelStyle} experiences tailored to your interests.`,
      destination: this.capitalize(destination),
      duration,
      totalBudget: Math.round(totalCost),
      days,
      metadata: {
        generatedBy: 'TravelSensei AI',
        travelStyle,
        interests,
        confidence: 0.92
      },
      createdAt: new Date().toISOString()
    };
  }

  /**
   * Select activities for a specific day based on preferences
   * @param {Activity[]} allActivities 
   * @param {string[]} interests 
   * @param {string} travelStyle 
   * @param {number} dailyBudget 
   * @param {number} dayNumber 
   * @returns {Activity[]}
   */
  selectActivitiesForDay(allActivities, interests, travelStyle, dailyBudget, dayNumber) {
    // Simple algorithm to select 2-3 activities per day
    const shuffled = [...allActivities].sort(() => 0.5 - Math.random());
    const selected = [];
    let currentBudget = 0;
    let currentTime = 0;

    for (const activity of shuffled) {
      if (selected.length >= 3) break;
      if (currentBudget + activity.cost > dailyBudget * 1.2) continue;
      if (currentTime + activity.duration > 10) continue;

      // Prefer activities that match user interests
      const matchesInterests = interests.some(interest => 
        activity.tags.includes(interest.toLowerCase()) ||
        activity.category.toLowerCase().includes(interest.toLowerCase())
      );

      if (matchesInterests || selected.length < 2) {
        selected.push(activity);
        currentBudget += activity.cost;
        currentTime += activity.duration;
      }
    }

    return selected.length > 0 ? selected : shuffled.slice(0, 2);
  }

  /**
   * Generate a theme for each day
   * @param {number} dayNumber 
   * @param {string} travelStyle 
   * @returns {string}
   */
  getDayTheme(dayNumber, travelStyle) {
    const themes = {
      adventure: ['Arrival & Orientation', 'Cultural Immersion', 'Nature Exploration', 'Local Experiences', 'Farewell Adventure'],
      cultural: ['Historical Discovery', 'Art & Museums', 'Local Traditions', 'Cultural Exchange', 'Heritage Sites'],
      relaxation: ['Gentle Arrival', 'Spa & Wellness', 'Scenic Views', 'Peaceful Exploration', 'Tranquil Departure'],
      luxury: ['VIP Arrival', 'Exclusive Experiences', 'Fine Dining', 'Premium Activities', 'Luxury Farewell'],
      budget: ['Efficient Arrival', 'Free Attractions', 'Local Markets', 'Budget Adventures', 'Smart Departure']
    };

    const styleThemes = themes[travelStyle] || themes.cultural;
    return styleThemes[Math.min(dayNumber - 1, styleThemes.length - 1)] || `Day ${dayNumber} Exploration`;
  }

  /**
   * Get date for a specific day of the trip
   * @param {string} startDate 
   * @param {number} dayOffset 
   * @returns {string}
   */
  getDateForDay(startDate, dayOffset) {
    if (!startDate) {
      const today = new Date();
      today.setDate(today.getDate() + dayOffset);
      return today.toISOString().split('T')[0];
    }

    const date = new Date(startDate);
    date.setDate(date.getDate() + dayOffset);
    return date.toISOString().split('T')[0];
  }

  /**
   * Capitalize first letter of a string
   * @param {string} str 
   * @returns {string}
   */
  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  /**
   * Simulate async delay
   * @param {number} ms 
   * @returns {Promise<void>}
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get travel suggestions based on user preferences
   * @param {Object} preferences - User preferences
   * @returns {Promise<Object[]>} Array of destination suggestions
   */
  async getDestinationSuggestions(preferences) {
    await this.delay(1000);

    const suggestions = [
      {
        destination: 'Tokyo, Japan',
        match: 95,
        reasons: ['Cultural experiences', 'Food adventures', 'Technology'],
        imageUrl: '/images/tokyo.jpg',
        estimatedCost: '$2500-3500',
        bestTime: 'March-May, September-November'
      },
      {
        destination: 'Paris, France',
        match: 88,
        reasons: ['Art & Culture', 'Romance', 'Architecture'],
        imageUrl: '/images/paris.jpg',
        estimatedCost: '$3000-4000',
        bestTime: 'April-June, September-October'
      },
      {
        destination: 'Bali, Indonesia',
        match: 82,
        reasons: ['Relaxation', 'Nature', 'Wellness'],
        imageUrl: '/images/bali.jpg',
        estimatedCost: '$1500-2500',
        bestTime: 'April-October'
      }
    ];

    return suggestions;
  }

  /**
   * Refine an existing itinerary based on user feedback
   * @param {string} itineraryId 
   * @param {Object} feedback 
   * @returns {Promise<GeneratedItinerary>}
   */
  async refineItinerary(itineraryId, feedback) {
    await this.delay(1500);
    
    // In a real implementation, this would use AI to refine the itinerary
    // For now, return a mock refined version
    throw new Error('Itinerary refinement not implemented in demo version');
  }
}

// Export singleton instance
export const aiService = new AIService();
export default aiService;