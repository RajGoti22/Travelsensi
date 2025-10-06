const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  bookingId: {
    type: String,
    required: [true, 'Booking ID is required'],
    unique: true,
    uppercase: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  type: {
    type: String,
    enum: ['flight', 'hotel', 'activity', 'package'],
    required: [true, 'Booking type is required']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed', 'refunded'],
    default: 'pending'
  },
  
  // Flight booking details
  flight: {
    airline: String,
    flightNumber: String,
    departure: {
      airport: String,
      city: String,
      country: String,
      date: Date,
      time: String,
      terminal: String
    },
    arrival: {
      airport: String,
      city: String,
      country: String,
      date: Date,
      time: String,
      terminal: String
    },
    passengers: [{
      title: String,
      firstName: String,
      lastName: String,
      dateOfBirth: Date,
      passportNumber: String,
      nationality: String,
      seatNumber: String,
      mealPreference: String
    }],
    class: {
      type: String,
      enum: ['economy', 'premium-economy', 'business', 'first'],
      default: 'economy'
    },
    baggage: {
      cabin: { weight: Number, pieces: Number },
      checked: { weight: Number, pieces: Number }
    }
  },

  // Hotel booking details
  hotel: {
    name: { type: String, required: function() { return this.type === 'hotel'; } },
    address: String,
    city: String,
    country: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    },
    checkIn: { type: Date, required: function() { return this.type === 'hotel'; } },
    checkOut: { type: Date, required: function() { return this.type === 'hotel'; } },
    nights: Number,
    rooms: [{
      type: String, // single, double, suite, etc.
      guests: Number,
      bedType: String,
      smoking: Boolean,
      view: String
    }],
    guests: [{
      firstName: String,
      lastName: String,
      age: Number
    }],
    amenities: [String],
    rating: Number,
    cancellationPolicy: String,
    specialRequests: String
  },

  // Activity booking details
  activity: {
    name: { type: String, required: function() { return this.type === 'activity'; } },
    provider: String,
    location: {
      name: String,
      address: String,
      city: String,
      country: String,
      coordinates: {
        latitude: Number,
        longitude: Number
      }
    },
    date: { type: Date, required: function() { return this.type === 'activity'; } },
    time: String,
    duration: String,
    participants: Number,
    ageRestrictions: {
      minimum: Number,
      maximum: Number
    },
    difficulty: String,
    includes: [String],
    excludes: [String],
    requirements: [String],
    meetingPoint: String,
    cancellationPolicy: String
  },

  // Package booking details (combination of flight, hotel, activities)
  package: {
    name: String,
    description: String,
    destination: String,
    duration: {
      days: Number,
      nights: Number
    },
    startDate: Date,
    endDate: Date,
    includes: [String],
    excludes: [String],
    itinerary: [{
      day: Number,
      activities: [String]
    }]
  },

  // Pricing information
  pricing: {
    basePrice: {
      type: Number,
      required: [true, 'Base price is required'],
      min: [0, 'Price cannot be negative']
    },
    taxes: { type: Number, default: 0 },
    fees: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    total: {
      type: Number,
      required: [true, 'Total price is required']
    },
    currency: {
      type: String,
      required: [true, 'Currency is required'],
      default: 'USD',
      uppercase: true
    }
  },

  // Payment information
  payment: {
    method: {
      type: String,
      enum: ['credit-card', 'debit-card', 'paypal', 'bank-transfer', 'cash'],
      required: [true, 'Payment method is required']
    },
    transactionId: String,
    paidAmount: { type: Number, default: 0 },
    paymentDate: Date,
    refundAmount: { type: Number, default: 0 },
    refundDate: Date,
    installments: [{
      amount: Number,
      dueDate: Date,
      status: { type: String, enum: ['pending', 'paid', 'overdue'], default: 'pending' }
    }]
  },

  // Contact information
  contactInfo: {
    email: {
      type: String,
      required: [true, 'Contact email is required']
    },
    phone: {
      type: String,
      required: [true, 'Contact phone is required']
    },
    emergencyContact: {
      name: String,
      phone: String,
      relationship: String
    }
  },

  // Additional information
  specialRequests: String,
  notes: String,
  confirmationCode: String,
  vouchers: [{
    type: String,
    url: String,
    expiryDate: Date
  }],

  // Booking source
  source: {
    platform: String, // website, mobile app, agent
    agent: String,
    referralCode: String
  },

  // Related itinerary
  relatedItinerary: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Itinerary'
  },

  // Timestamps for booking lifecycle
  bookingDate: { type: Date, default: Date.now },
  confirmationDate: Date,
  cancellationDate: Date,
  completionDate: Date,

  // Communication history
  communications: [{
    type: { type: String, enum: ['email', 'sms', 'call', 'system'] },
    subject: String,
    message: String,
    sentAt: { type: Date, default: Date.now },
    status: { type: String, enum: ['sent', 'delivered', 'read', 'failed'], default: 'sent' }
  }],

  // Review after completion
  review: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for booking duration (for hotels and packages)
bookingSchema.virtual('duration').get(function() {
  if (this.type === 'hotel' && this.hotel.checkIn && this.hotel.checkOut) {
    const diffTime = Math.abs(this.hotel.checkOut - this.hotel.checkIn);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
  if (this.type === 'package') {
    return this.package.duration.days;
  }
  return null;
});

// Pre-save middleware to calculate total price
bookingSchema.pre('save', function(next) {
  if (this.isModified('pricing')) {
    this.pricing.total = 
      (this.pricing.basePrice || 0) + 
      (this.pricing.taxes || 0) + 
      (this.pricing.fees || 0) - 
      (this.pricing.discount || 0);
  }
  next();
});

// Pre-save middleware to generate booking ID
bookingSchema.pre('save', function(next) {
  if (!this.bookingId) {
    const prefix = this.type.toUpperCase().slice(0, 3);
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    this.bookingId = `${prefix}${timestamp}${random}`;
  }
  next();
});

// Indexes for performance
bookingSchema.index({ bookingId: 1 });
bookingSchema.index({ user: 1 });
bookingSchema.index({ type: 1, status: 1 });
bookingSchema.index({ 'hotel.checkIn': 1, 'hotel.checkOut': 1 });
bookingSchema.index({ 'flight.departure.date': 1 });
bookingSchema.index({ 'activity.date': 1 });
bookingSchema.index({ bookingDate: -1 });

module.exports = mongoose.model('Booking', bookingSchema);