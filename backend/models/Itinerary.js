const mongoose = require('mongoose');

const itinerarySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Itinerary title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  destination: {
    name: {
      type: String,
      required: [true, 'Destination name is required']
    },
    country: {
      type: String,
      required: [true, 'Country is required']
    },
    coordinates: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true }
    },
    address: String
  },
  duration: {
    days: {
      type: Number,
      required: [true, 'Duration in days is required'],
      min: [1, 'Duration must be at least 1 day']
    },
    nights: {
      type: Number,
      required: [true, 'Duration in nights is required'],
      min: [0, 'Nights cannot be negative']
    }
  },
  dateRange: {
    startDate: {
      type: Date,
      required: [true, 'Start date is required']
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required']
    }
  },
  budget: {
    total: {
      type: Number,
      required: [true, 'Total budget is required'],
      min: [0, 'Budget cannot be negative']
    },
    currency: {
      type: String,
      required: [true, 'Currency is required'],
      default: 'USD',
      uppercase: true
    },
    breakdown: {
      accommodation: { type: Number, default: 0 },
      food: { type: Number, default: 0 },
      activities: { type: Number, default: 0 },
      transportation: { type: Number, default: 0 },
      shopping: { type: Number, default: 0 },
      other: { type: Number, default: 0 }
    }
  },
  activities: [{
    day: {
      type: Number,
      required: [true, 'Day number is required'],
      min: [1, 'Day must be at least 1']
    },
    time: {
      type: String,
      required: [true, 'Time is required']
    },
    title: {
      type: String,
      required: [true, 'Activity title is required'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Activity description is required']
    },
    location: {
      name: String,
      address: String,
      coordinates: {
        latitude: Number,
        longitude: Number
      }
    },
    duration: {
      type: String, // e.g., "2 hours", "Half day"
      required: [true, 'Duration is required']
    },
    cost: {
      amount: { type: Number, default: 0 },
      currency: { type: String, default: 'USD' }
    },
    category: {
      type: String,
      enum: ['sightseeing', 'food', 'adventure', 'cultural', 'shopping', 'relaxation', 'transportation'],
      required: [true, 'Category is required']
    },
    bookingRequired: { type: Boolean, default: false },
    bookingUrl: String,
    images: [String],
    tips: [String]
  }],
  transportation: {
    arrival: {
      type: { type: String, enum: ['flight', 'train', 'bus', 'car', 'other'] },
      details: String,
      cost: { type: Number, default: 0 }
    },
    local: {
      primary: { type: String, enum: ['walking', 'public', 'taxi', 'rental', 'bike'] },
      details: String,
      estimatedCost: { type: Number, default: 0 }
    },
    departure: {
      type: { type: String, enum: ['flight', 'train', 'bus', 'car', 'other'] },
      details: String,
      cost: { type: Number, default: 0 }
    }
  },
  accommodation: {
    name: String,
    type: { type: String, enum: ['hotel', 'hostel', 'apartment', 'resort', 'guesthouse', 'other'] },
    address: String,
    checkIn: Date,
    checkOut: Date,
    cost: { type: Number, default: 0 },
    bookingUrl: String,
    amenities: [String],
    rating: { type: Number, min: 0, max: 5 }
  },
  tags: [String],
  difficulty: {
    type: String,
    enum: ['easy', 'moderate', 'challenging'],
    default: 'moderate'
  },
  season: {
    type: String,
    enum: ['spring', 'summer', 'autumn', 'winter', 'any'],
    default: 'any'
  },
  groupSize: {
    min: { type: Number, default: 1 },
    max: { type: Number, default: 10 },
    recommended: { type: Number, default: 2 }
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Creator is required']
  },
  isPublic: { type: Boolean, default: true },
  isAIGenerated: { type: Boolean, default: false },
  aiPrompt: String, // Store the original AI prompt for reference
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  stats: {
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    saves: { type: Number, default: 0 },
    shares: { type: Number, default: 0 }
  },
  reviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review'
  }],
  images: [{
    url: { type: String, required: true },
    caption: String,
    publicId: String // For Cloudinary
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for average rating
itinerarySchema.virtual('averageRating').get(function() {
  if (!this.reviews || this.reviews.length === 0) return 0;
  // This would be calculated when reviews are populated
  return this.calculatedRating || 0;
});

// Virtual for total cost
itinerarySchema.virtual('totalCalculatedCost').get(function() {
  let total = this.accommodation.cost || 0;
  total += this.transportation.arrival.cost || 0;
  total += this.transportation.local.estimatedCost || 0;
  total += this.transportation.departure.cost || 0;
  total += this.activities.reduce((sum, activity) => sum + (activity.cost.amount || 0), 0);
  return total;
});

// Pre-save middleware to calculate total cost
itinerarySchema.pre('save', function(next) {
  if (this.isModified('activities') || this.isModified('accommodation') || this.isModified('transportation')) {
    // Update budget breakdown
    this.budget.breakdown.accommodation = this.accommodation.cost || 0;
    this.budget.breakdown.transportation = 
      (this.transportation.arrival.cost || 0) + 
      (this.transportation.local.estimatedCost || 0) + 
      (this.transportation.departure.cost || 0);
    this.budget.breakdown.activities = this.activities.reduce((sum, activity) => 
      sum + (activity.cost.amount || 0), 0);
  }
  next();
});

// Indexes for performance
itinerarySchema.index({ 'destination.name': 1, 'destination.country': 1 });
itinerarySchema.index({ createdBy: 1 });
itinerarySchema.index({ status: 1, isPublic: 1 });
itinerarySchema.index({ 'dateRange.startDate': 1 });
itinerarySchema.index({ tags: 1 });
itinerarySchema.index({ createdAt: -1 });

module.exports = mongoose.model('Itinerary', itinerarySchema);