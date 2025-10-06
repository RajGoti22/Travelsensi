const express = require('express');
const { auth } = require('../middleware/auth');
const Booking = require('../models/Booking');
const Itinerary = require('../models/Itinerary');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// @desc    Get user's bookings
// @route   GET /api/bookings
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = { user: req.user._id };

    // Filter by status
    if (req.query.status) {
      query.status = req.query.status;
    }

    // Filter by booking type
    if (req.query.type) {
      query.bookingType = req.query.type;
    }

    // Filter by date range
    if (req.query.startDate || req.query.endDate) {
      query.travelDates = {};
      if (req.query.startDate) {
        query['travelDates.startDate'] = { $gte: new Date(req.query.startDate) };
      }
      if (req.query.endDate) {
        query['travelDates.endDate'] = { $lte: new Date(req.query.endDate) };
      }
    }

    const bookings = await Booking.find(query)
      .populate('itinerary', 'title destination images')
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Booking.countDocuments(query);

    res.json({
      success: true,
      data: {
        bookings,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalBookings: total,
          hasNext: skip + bookings.length < total,
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching bookings'
    });
  }
});

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('itinerary', 'title destination images activities budget')
      .populate('user', 'name email phone');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user owns the booking
    if (booking.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this booking'
      });
    }

    res.json({
      success: true,
      data: {
        booking
      }
    });
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching booking'
    });
  }
});

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
router.post('/', auth, [
  body('itinerary')
    .notEmpty()
    .withMessage('Itinerary ID is required')
    .isMongoId()
    .withMessage('Invalid itinerary ID'),
  body('bookingType')
    .isIn(['full_package', 'custom', 'consultation'])
    .withMessage('Invalid booking type'),
  body('travelDates.startDate')
    .notEmpty()
    .withMessage('Travel start date is required')
    .isISO8601()
    .withMessage('Invalid start date format'),
  body('travelDates.endDate')
    .notEmpty()
    .withMessage('Travel end date is required')
    .isISO8601()
    .withMessage('Invalid end date format'),
  body('travelers.adults')
    .isInt({ min: 1, max: 20 })
    .withMessage('Number of adults must be between 1 and 20'),
  body('contactInfo.name')
    .notEmpty()
    .withMessage('Contact name is required'),
  body('contactInfo.email')
    .isEmail()
    .withMessage('Valid email is required'),
  body('contactInfo.phone')
    .notEmpty()
    .withMessage('Contact phone is required')
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

    // Validate travel dates
    const startDate = new Date(req.body.travelDates.startDate);
    const endDate = new Date(req.body.travelDates.endDate);
    
    if (startDate >= endDate) {
      return res.status(400).json({
        success: false,
        message: 'End date must be after start date'
      });
    }

    if (startDate < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Travel dates cannot be in the past'
      });
    }

    // Generate booking reference
    const bookingReference = 'TS' + Date.now().toString().slice(-8) + Math.random().toString(36).substr(2, 4).toUpperCase();

    const bookingData = {
      ...req.body,
      user: req.user._id,
      bookingReference,
      status: 'pending'
    };

    // Calculate total travelers
    const totalTravelers = (req.body.travelers.adults || 0) + 
                          (req.body.travelers.children || 0) + 
                          (req.body.travelers.infants || 0);
    bookingData.travelers.total = totalTravelers;

    // Calculate estimated pricing based on itinerary budget and travelers
    if (itinerary.budget && itinerary.budget.total) {
      const basePrice = itinerary.budget.total;
      let totalPrice = basePrice * (req.body.travelers.adults || 1);
      
      // Add 50% for children, 25% for infants
      if (req.body.travelers.children) {
        totalPrice += (basePrice * 0.5) * req.body.travelers.children;
      }
      if (req.body.travelers.infants) {
        totalPrice += (basePrice * 0.25) * req.body.travelers.infants;
      }

      bookingData.pricing = {
        basePrice,
        totalPrice,
        currency: itinerary.budget.currency || 'USD',
        breakdown: {
          adults: basePrice * (req.body.travelers.adults || 1),
          children: req.body.travelers.children ? (basePrice * 0.5) * req.body.travelers.children : 0,
          infants: req.body.travelers.infants ? (basePrice * 0.25) * req.body.travelers.infants : 0
        }
      };
    }

    const booking = await Booking.create(bookingData);
    
    await booking.populate([
      { path: 'itinerary', select: 'title destination images' },
      { path: 'user', select: 'name email' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: {
        booking
      }
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating booking'
    });
  }
});

// @desc    Update booking
// @route   PUT /api/bookings/:id
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    let booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user owns the booking
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this booking'
      });
    }

    // Only allow updates if booking is still pending or confirmed
    if (!['pending', 'confirmed'].includes(booking.status)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot update booking in current status'
      });
    }

    // Update allowed fields
    const allowedUpdates = [
      'travelDates', 'travelers', 'contactInfo', 'specialRequests', 
      'preferences', 'emergencyContact', 'notes'
    ];

    const updates = {};
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    // Validate travel dates if being updated
    if (updates.travelDates) {
      const startDate = new Date(updates.travelDates.startDate);
      const endDate = new Date(updates.travelDates.endDate);
      
      if (startDate >= endDate) {
        return res.status(400).json({
          success: false,
          message: 'End date must be after start date'
        });
      }

      if (startDate < new Date()) {
        return res.status(400).json({
          success: false,
          message: 'Travel dates cannot be in the past'
        });
      }
    }

    // Recalculate total travelers if updated
    if (updates.travelers) {
      const totalTravelers = (updates.travelers.adults || 0) + 
                            (updates.travelers.children || 0) + 
                            (updates.travelers.infants || 0);
      updates.travelers.total = totalTravelers;
    }

    booking = await Booking.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).populate([
      { path: 'itinerary', select: 'title destination images' },
      { path: 'user', select: 'name email' }
    ]);

    res.json({
      success: true,
      message: 'Booking updated successfully',
      data: {
        booking
      }
    });
  } catch (error) {
    console.error('Update booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating booking'
    });
  }
});

// @desc    Cancel booking
// @route   POST /api/bookings/:id/cancel
// @access  Private
router.post('/:id/cancel', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user owns the booking
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this booking'
      });
    }

    // Check if booking can be cancelled
    if (!['pending', 'confirmed'].includes(booking.status)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel booking in current status'
      });
    }

    // Update booking status
    booking.status = 'cancelled';
    booking.cancellation = {
      date: new Date(),
      reason: req.body.reason || 'Cancelled by user',
      refundStatus: 'pending'
    };

    await booking.save();

    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      data: {
        booking
      }
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Error cancelling booking'
    });
  }
});

// @desc    Get booking statistics
// @route   GET /api/bookings/stats
// @access  Private
router.get('/stats', auth, async (req, res) => {
  try {
    const userId = req.user._id;

    // Get booking counts by status
    const statusStats = await Booking.aggregate([
      { $match: { user: userId } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Get total bookings and total spent
    const totalStats = await Booking.aggregate([
      { $match: { user: userId } },
      { 
        $group: { 
          _id: null, 
          totalBookings: { $sum: 1 },
          totalSpent: { $sum: '$pricing.totalPrice' }
        } 
      }
    ]);

    // Get upcoming bookings
    const upcomingBookings = await Booking.countDocuments({
      user: userId,
      'travelDates.startDate': { $gte: new Date() },
      status: { $in: ['confirmed', 'pending'] }
    });

    // Get bookings by month (last 12 months)
    const monthlyStats = await Booking.aggregate([
      { 
        $match: { 
          user: userId,
          createdAt: { $gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) }
        } 
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 },
          totalSpent: { $sum: '$pricing.totalPrice' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.json({
      success: true,
      data: {
        statusStats,
        totalStats: totalStats[0] || { totalBookings: 0, totalSpent: 0 },
        upcomingBookings,
        monthlyStats
      }
    });
  } catch (error) {
    console.error('Get booking stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching booking statistics'
    });
  }
});

module.exports = router;