const express = require('express');
const { auth, optionalAuth } = require('../middleware/auth');
const Review = require('../models/Review');
const Itinerary = require('../models/Itinerary');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// @desc    Get reviews for an itinerary
// @route   GET /api/reviews/itinerary/:itineraryId
// @access  Public
router.get('/itinerary/:itineraryId', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = {
      itinerary: req.params.itineraryId,
      isPublic: true,
      moderationStatus: 'approved'
    };

    // Filter by rating
    if (req.query.minRating) {
      query['rating.overall'] = { $gte: parseInt(req.query.minRating) };
    }

    // Sort options
    let sort = { createdAt: -1 }; // Default sort by newest
    if (req.query.sort === 'rating-high') {
      sort = { 'rating.overall': -1, createdAt: -1 };
    } else if (req.query.sort === 'rating-low') {
      sort = { 'rating.overall': 1, createdAt: -1 };
    } else if (req.query.sort === 'helpful') {
      sort = { 'engagement.helpfulCount': -1, createdAt: -1 };
    }

    const reviews = await Review.find(query)
      .populate('user', 'name avatar stats')
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await Review.countDocuments(query);

    // Get rating distribution
    const ratingStats = await Review.aggregate([
      { $match: { itinerary: req.params.itineraryId, isPublic: true, moderationStatus: 'approved' } },
      {
        $group: {
          _id: '$rating.overall',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: -1 } }
    ]);

    // Get average ratings
    const avgRatings = await Review.aggregate([
      { $match: { itinerary: req.params.itineraryId, isPublic: true, moderationStatus: 'approved' } },
      {
        $group: {
          _id: null,
          averageOverall: { $avg: '$rating.overall' },
          averageValue: { $avg: '$rating.value' },
          averageService: { $avg: '$rating.service' },
          averageExperience: { $avg: '$rating.experience' },
          averageAccommodation: { $avg: '$rating.accommodation' },
          totalReviews: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        reviews,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalReviews: total,
          hasNext: skip + reviews.length < total,
          hasPrev: page > 1
        },
        stats: {
          ratingDistribution: ratingStats,
          averageRatings: avgRatings[0] || {
            averageOverall: 0,
            averageValue: 0,
            averageService: 0,
            averageExperience: 0,
            averageAccommodation: 0,
            totalReviews: 0
          }
        }
      }
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching reviews'
    });
  }
});

// @desc    Get single review
// @route   GET /api/reviews/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate('user', 'name avatar bio stats')
      .populate('itinerary', 'title destination images');

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if review is public
    if (!review.isPublic || review.moderationStatus !== 'approved') {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    res.json({
      success: true,
      data: {
        review
      }
    });
  } catch (error) {
    console.error('Get review error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching review'
    });
  }
});

// @desc    Create new review
// @route   POST /api/reviews
// @access  Private
router.post('/', auth, [
  body('itinerary')
    .notEmpty()
    .withMessage('Itinerary ID is required')
    .isMongoId()
    .withMessage('Invalid itinerary ID'),
  body('title')
    .notEmpty()
    .withMessage('Review title is required')
    .isLength({ min: 5, max: 200 })
    .withMessage('Title must be between 5 and 200 characters'),
  body('content')
    .notEmpty()
    .withMessage('Review content is required')
    .isLength({ min: 20, max: 2000 })
    .withMessage('Content must be between 20 and 2000 characters'),
  body('rating.overall')
    .isInt({ min: 1, max: 5 })
    .withMessage('Overall rating must be between 1 and 5'),
  body('rating.value')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Value rating must be between 1 and 5'),
  body('rating.service')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Service rating must be between 1 and 5'),
  body('rating.experience')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Experience rating must be between 1 and 5'),
  body('rating.accommodation')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Accommodation rating must be between 1 and 5')
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

    // Verify itinerary exists
    const itinerary = await Itinerary.findById(req.body.itinerary);
    if (!itinerary) {
      return res.status(404).json({
        success: false,
        message: 'Itinerary not found'
      });
    }

    // Check if user has already reviewed this itinerary
    const existingReview = await Review.findOne({
      itinerary: req.body.itinerary,
      user: req.user._id
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this itinerary'
      });
    }

    // Don't allow users to review their own itineraries
    if (itinerary.createdBy.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot review your own itinerary'
      });
    }

    const reviewData = {
      ...req.body,
      user: req.user._id
    };

    const review = await Review.create(reviewData);
    
    await review.populate([
      { path: 'user', select: 'name avatar' },
      { path: 'itinerary', select: 'title destination' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Review created successfully',
      data: {
        review
      }
    });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating review'
    });
  }
});

// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Private (Owner only)
router.put('/:id', auth, async (req, res) => {
  try {
    let review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if user owns the review
    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this review'
      });
    }

    // Update allowed fields
    const allowedUpdates = [
      'title', 'content', 'rating', 'travelDate', 'tripType', 
      'groupSize', 'pros', 'cons', 'tips', 'images', 'isPublic'
    ];

    const updates = {};
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    // Reset moderation status if content changed
    if (updates.title || updates.content) {
      updates.moderationStatus = 'pending';
    }

    review = await Review.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).populate([
      { path: 'user', select: 'name avatar' },
      { path: 'itinerary', select: 'title destination' }
    ]);

    res.json({
      success: true,
      message: 'Review updated successfully',
      data: {
        review
      }
    });
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating review'
    });
  }
});

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private (Owner only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if user owns the review
    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this review'
      });
    }

    await Review.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting review'
    });
  }
});

// @desc    Mark review as helpful/unhelpful
// @route   POST /api/reviews/:id/helpful
// @access  Private
router.post('/:id/helpful', auth, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Don't allow users to mark their own reviews as helpful
    if (review.user.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot mark your own review as helpful'
      });
    }

    const isHelpful = req.body.helpful === true;
    
    if (isHelpful) {
      review.engagement.helpfulCount += 1;
    } else {
      review.engagement.helpfulCount = Math.max(0, review.engagement.helpfulCount - 1);
    }

    await review.save();

    res.json({
      success: true,
      message: isHelpful ? 'Review marked as helpful' : 'Review marked as not helpful',
      data: {
        helpful: isHelpful,
        totalHelpful: review.engagement.helpfulCount
      }
    });
  } catch (error) {
    console.error('Mark review helpful error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating helpful status'
    });
  }
});

// @desc    Report review
// @route   POST /api/reviews/:id/report
// @access  Private
router.post('/:id/report', auth, [
  body('reason')
    .notEmpty()
    .withMessage('Report reason is required')
    .isIn(['spam', 'inappropriate', 'fake', 'offensive', 'other'])
    .withMessage('Invalid report reason'),
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description must be less than 500 characters')
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

    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Don't allow users to report their own reviews
    if (review.user.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot report your own review'
      });
    }

    // Add report to review
    const report = {
      user: req.user._id,
      reason: req.body.reason,
      description: req.body.description,
      date: new Date()
    };

    review.moderation.reports.push(report);
    review.moderation.reportCount += 1;

    // Auto-hide review if it has multiple reports
    if (review.moderation.reportCount >= 3) {
      review.moderationStatus = 'flagged';
    }

    await review.save();

    res.json({
      success: true,
      message: 'Review reported successfully'
    });
  } catch (error) {
    console.error('Report review error:', error);
    res.status(500).json({
      success: false,
      message: 'Error reporting review'
    });
  }
});

// @desc    Get user's reviews
// @route   GET /api/reviews/my/all
// @access  Private
router.get('/my/all', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = { user: req.user._id };

    // Filter by status
    if (req.query.status) {
      query.moderationStatus = req.query.status;
    }

    const reviews = await Review.find(query)
      .populate('itinerary', 'title destination images')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Review.countDocuments(query);

    res.json({
      success: true,
      data: {
        reviews,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalReviews: total,
          hasNext: skip + reviews.length < total,
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Get my reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching your reviews'
    });
  }
});

// @desc    Get review statistics for user
// @route   GET /api/reviews/my/stats
// @access  Private
router.get('/my/stats', auth, async (req, res) => {
  try {
    const userId = req.user._id;

    // Get review counts by status
    const statusStats = await Review.aggregate([
      { $match: { user: userId } },
      { $group: { _id: '$moderationStatus', count: { $sum: 1 } } }
    ]);

    // Get total reviews and average rating
    const totalStats = await Review.aggregate([
      { $match: { user: userId } },
      { 
        $group: { 
          _id: null, 
          totalReviews: { $sum: 1 },
          averageRating: { $avg: '$rating.overall' },
          totalHelpful: { $sum: '$engagement.helpfulCount' }
        } 
      }
    ]);

    // Get rating distribution
    const ratingDistribution = await Review.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: '$rating.overall',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: -1 } }
    ]);

    res.json({
      success: true,
      data: {
        statusStats,
        totalStats: totalStats[0] || { totalReviews: 0, averageRating: 0, totalHelpful: 0 },
        ratingDistribution
      }
    });
  } catch (error) {
    console.error('Get review stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching review statistics'
    });
  }
});

module.exports = router;