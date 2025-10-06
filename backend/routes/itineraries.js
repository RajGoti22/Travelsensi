const express = require('express');
const { auth, optionalAuth } = require('../middleware/auth');
const Itinerary = require('../models/Itinerary');
const Review = require('../models/Review');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// @desc    Get all itineraries
// @route   GET /api/itineraries
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    // Build query
    const query = { isPublic: true, status: 'published' };

    // Filter by destination
    if (req.query.destination) {
      query.$or = [
        { 'destination.name': { $regex: req.query.destination, $options: 'i' } },
        { 'destination.country': { $regex: req.query.destination, $options: 'i' } }
      ];
    }

    // Filter by duration
    if (req.query.minDays || req.query.maxDays) {
      query['duration.days'] = {};
      if (req.query.minDays) query['duration.days'].$gte = parseInt(req.query.minDays);
      if (req.query.maxDays) query['duration.days'].$lte = parseInt(req.query.maxDays);
    }

    // Filter by budget
    if (req.query.minBudget || req.query.maxBudget) {
      query['budget.total'] = {};
      if (req.query.minBudget) query['budget.total'].$gte = parseInt(req.query.minBudget);
      if (req.query.maxBudget) query['budget.total'].$lte = parseInt(req.query.maxBudget);
    }

    // Filter by tags
    if (req.query.tags) {
      const tags = req.query.tags.split(',').map(tag => tag.trim());
      query.tags = { $in: tags };
    }

    // Filter by difficulty
    if (req.query.difficulty) {
      query.difficulty = req.query.difficulty;
    }

    // Filter by season
    if (req.query.season) {
      query.season = req.query.season;
    }

    // Sort options
    let sort = { createdAt: -1 }; // Default sort by newest
    if (req.query.sort === 'popular') {
      sort = { 'stats.views': -1, 'stats.likes': -1 };
    } else if (req.query.sort === 'budget-low') {
      sort = { 'budget.total': 1 };
    } else if (req.query.sort === 'budget-high') {
      sort = { 'budget.total': -1 };
    } else if (req.query.sort === 'duration') {
      sort = { 'duration.days': 1 };
    }

    const itineraries = await Itinerary.find(query)
      .populate('createdBy', 'name avatar stats')
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await Itinerary.countDocuments(query);

    res.json({
      success: true,
      data: {
        itineraries,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalItineraries: total,
          hasNext: skip + itineraries.length < total,
          hasPrev: page > 1
        },
        filters: {
          destination: req.query.destination,
          minDays: req.query.minDays,
          maxDays: req.query.maxDays,
          minBudget: req.query.minBudget,
          maxBudget: req.query.maxBudget,
          tags: req.query.tags,
          difficulty: req.query.difficulty,
          season: req.query.season,
          sort: req.query.sort
        }
      }
    });
  } catch (error) {
    console.error('Get itineraries error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching itineraries'
    });
  }
});

// @desc    Get single itinerary
// @route   GET /api/itineraries/:id
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const itinerary = await Itinerary.findById(req.params.id)
      .populate('createdBy', 'name avatar bio stats')
      .populate({
        path: 'reviews',
        populate: {
          path: 'user',
          select: 'name avatar'
        },
        match: { isPublic: true, moderationStatus: 'approved' },
        options: { limit: 5, sort: { createdAt: -1 } }
      });

    if (!itinerary) {
      return res.status(404).json({
        success: false,
        message: 'Itinerary not found'
      });
    }

    // Check if itinerary is accessible
    if (!itinerary.isPublic || itinerary.status !== 'published') {
      // Only owner can see private or draft itineraries
      if (!req.user || req.user._id.toString() !== itinerary.createdBy._id.toString()) {
        return res.status(404).json({
          success: false,
          message: 'Itinerary not found'
        });
      }
    }

    // Increment view count (only if not the owner viewing)
    if (!req.user || req.user._id.toString() !== itinerary.createdBy._id.toString()) {
      itinerary.stats.views += 1;
      await itinerary.save();
    }

    res.json({
      success: true,
      data: {
        itinerary
      }
    });
  } catch (error) {
    console.error('Get itinerary error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching itinerary'
    });
  }
});

// @desc    Create new itinerary
// @route   POST /api/itineraries
// @access  Private
router.post('/', auth, [
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 5, max: 200 })
    .withMessage('Title must be between 5 and 200 characters'),
  body('description')
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 20, max: 1000 })
    .withMessage('Description must be between 20 and 1000 characters'),
  body('destination.name')
    .notEmpty()
    .withMessage('Destination name is required'),
  body('destination.country')
    .notEmpty()
    .withMessage('Destination country is required'),
  body('duration.days')
    .isInt({ min: 1, max: 30 })
    .withMessage('Duration must be between 1 and 30 days'),
  body('budget.total')
    .isNumeric()
    .withMessage('Budget total must be a number')
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

    const itineraryData = {
      ...req.body,
      createdBy: req.user._id
    };

    // Calculate nights from days
    if (itineraryData.duration && itineraryData.duration.days) {
      itineraryData.duration.nights = itineraryData.duration.days - 1;
    }

    const itinerary = await Itinerary.create(itineraryData);
    
    await itinerary.populate('createdBy', 'name avatar');

    res.status(201).json({
      success: true,
      message: 'Itinerary created successfully',
      data: {
        itinerary
      }
    });
  } catch (error) {
    console.error('Create itinerary error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating itinerary'
    });
  }
});

// @desc    Update itinerary
// @route   PUT /api/itineraries/:id
// @access  Private (Owner only)
router.put('/:id', auth, async (req, res) => {
  try {
    let itinerary = await Itinerary.findById(req.params.id);

    if (!itinerary) {
      return res.status(404).json({
        success: false,
        message: 'Itinerary not found'
      });
    }

    // Check if user owns the itinerary
    if (itinerary.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this itinerary'
      });
    }

    // Update fields
    const allowedUpdates = [
      'title', 'description', 'destination', 'duration', 'dateRange',
      'budget', 'activities', 'transportation', 'accommodation', 'tags',
      'difficulty', 'season', 'groupSize', 'isPublic', 'status', 'images'
    ];

    const updates = {};
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    // Recalculate nights if days changed
    if (updates.duration && updates.duration.days) {
      updates.duration.nights = updates.duration.days - 1;
    }

    itinerary = await Itinerary.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).populate('createdBy', 'name avatar');

    res.json({
      success: true,
      message: 'Itinerary updated successfully',
      data: {
        itinerary
      }
    });
  } catch (error) {
    console.error('Update itinerary error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating itinerary'
    });
  }
});

// @desc    Delete itinerary
// @route   DELETE /api/itineraries/:id
// @access  Private (Owner only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const itinerary = await Itinerary.findById(req.params.id);

    if (!itinerary) {
      return res.status(404).json({
        success: false,
        message: 'Itinerary not found'
      });
    }

    // Check if user owns the itinerary
    if (itinerary.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this itinerary'
      });
    }

    await Itinerary.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Itinerary deleted successfully'
    });
  } catch (error) {
    console.error('Delete itinerary error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting itinerary'
    });
  }
});

// @desc    Like/Unlike itinerary
// @route   POST /api/itineraries/:id/like
// @access  Private
router.post('/:id/like', auth, async (req, res) => {
  try {
    const itinerary = await Itinerary.findById(req.params.id);

    if (!itinerary) {
      return res.status(404).json({
        success: false,
        message: 'Itinerary not found'
      });
    }

    // Toggle like (implement in your User model to track liked itineraries)
    // For now, just increment/decrement the like count
    const isLiked = req.body.liked === true;
    
    if (isLiked) {
      itinerary.stats.likes += 1;
    } else {
      itinerary.stats.likes = Math.max(0, itinerary.stats.likes - 1);
    }

    await itinerary.save();

    res.json({
      success: true,
      message: isLiked ? 'Itinerary liked' : 'Itinerary unliked',
      data: {
        liked: isLiked,
        totalLikes: itinerary.stats.likes
      }
    });
  } catch (error) {
    console.error('Like itinerary error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating like status'
    });
  }
});

// @desc    Save/Unsave itinerary
// @route   POST /api/itineraries/:id/save
// @access  Private
router.post('/:id/save', auth, async (req, res) => {
  try {
    const itinerary = await Itinerary.findById(req.params.id);

    if (!itinerary) {
      return res.status(404).json({
        success: false,
        message: 'Itinerary not found'
      });
    }

    // Toggle save (implement in your User model to track saved itineraries)
    const isSaved = req.body.saved === true;
    
    if (isSaved) {
      itinerary.stats.saves += 1;
    } else {
      itinerary.stats.saves = Math.max(0, itinerary.stats.saves - 1);
    }

    await itinerary.save();

    res.json({
      success: true,
      message: isSaved ? 'Itinerary saved' : 'Itinerary unsaved',
      data: {
        saved: isSaved,
        totalSaves: itinerary.stats.saves
      }
    });
  } catch (error) {
    console.error('Save itinerary error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating save status'
    });
  }
});

// @desc    Get user's own itineraries
// @route   GET /api/itineraries/my/all
// @access  Private
router.get('/my/all', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const query = { createdBy: req.user._id };

    // Filter by status if provided
    if (req.query.status) {
      query.status = req.query.status;
    }

    const itineraries = await Itinerary.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Itinerary.countDocuments(query);

    res.json({
      success: true,
      data: {
        itineraries,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalItineraries: total,
          hasNext: skip + itineraries.length < total,
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Get my itineraries error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching your itineraries'
    });
  }
});

module.exports = router;