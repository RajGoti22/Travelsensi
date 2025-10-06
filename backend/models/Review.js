const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  reviewType: {
    type: String,
    enum: ['itinerary', 'destination', 'hotel', 'activity', 'restaurant'],
    required: [true, 'Review type is required']
  },
  
  // Reference to the reviewed item
  itinerary: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Itinerary',
    required: function() { return this.reviewType === 'itinerary'; }
  },
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking'
  },
  
  // General review information
  title: {
    type: String,
    required: [true, 'Review title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  content: {
    type: String,
    required: [true, 'Review content is required'],
    minlength: [10, 'Review must be at least 10 characters'],
    maxlength: [2000, 'Review cannot exceed 2000 characters']
  },
  rating: {
    overall: {
      type: Number,
      required: [true, 'Overall rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5']
    },
    // Detailed ratings for different aspects
    value: { type: Number, min: 1, max: 5 },
    service: { type: Number, min: 1, max: 5 },
    cleanliness: { type: Number, min: 1, max: 5 },
    location: { type: Number, min: 1, max: 5 },
    amenities: { type: Number, min: 1, max: 5 },
    food: { type: Number, min: 1, max: 5 }
  },

  // Location information
  destination: {
    name: String,
    city: String,
    country: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },

  // Trip details
  visitDate: {
    type: Date,
    required: [true, 'Visit date is required']
  },
  duration: {
    days: Number,
    nights: Number
  },
  travelType: {
    type: String,
    enum: ['solo', 'couple', 'family', 'friends', 'business'],
    required: [true, 'Travel type is required']
  },
  season: {
    type: String,
    enum: ['spring', 'summer', 'autumn', 'winter']
  },

  // Detailed review sections
  highlights: [{
    type: String,
    maxlength: [200, 'Highlight cannot exceed 200 characters']
  }],
  improvements: [{
    type: String,
    maxlength: [200, 'Improvement suggestion cannot exceed 200 characters']
  }],
  tips: [{
    type: String,
    maxlength: [300, 'Tip cannot exceed 300 characters']
  }],

  // Cost information
  budget: {
    total: Number,
    currency: { type: String, default: 'USD' },
    breakdown: {
      accommodation: Number,
      food: Number,
      activities: Number,
      transportation: Number,
      shopping: Number,
      other: Number
    }
  },

  // Media attachments
  images: [{
    url: { type: String, required: true },
    caption: String,
    publicId: String, // For Cloudinary
    location: {
      name: String,
      coordinates: {
        latitude: Number,
        longitude: Number
      }
    }
  }],
  videos: [{
    url: String,
    caption: String,
    duration: Number // in seconds
  }],

  // Engagement metrics
  stats: {
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    saves: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
    helpfulVotes: { type: Number, default: 0 }
  },

  // Moderation
  isVerified: { type: Boolean, default: false }, // Verified if linked to actual booking
  isPublic: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  moderationStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'flagged'],
    default: 'pending'
  },
  moderationNotes: String,

  // User interactions
  likes: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now }
  }],
  comments: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    content: { type: String, required: true, maxlength: 500 },
    createdAt: { type: Date, default: Date.now },
    isReply: { type: Boolean, default: false },
    parentComment: { type: mongoose.Schema.Types.ObjectId }
  }],
  reports: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reason: {
      type: String,
      enum: ['spam', 'inappropriate', 'fake', 'harassment', 'other'],
      required: true
    },
    description: String,
    createdAt: { type: Date, default: Date.now }
  }],

  // Helpful votes
  helpfulVotes: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isHelpful: Boolean, // true for helpful, false for not helpful
    createdAt: { type: Date, default: Date.now }
  }],

  // Tags for categorization
  tags: [{
    type: String,
    lowercase: true
  }],

  // Language of the review
  language: {
    type: String,
    default: 'en',
    lowercase: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for helpfulness score
reviewSchema.virtual('helpfulnessScore').get(function() {
  const helpful = this.helpfulVotes.filter(vote => vote.isHelpful).length;
  const notHelpful = this.helpfulVotes.filter(vote => !vote.isHelpful).length;
  const total = helpful + notHelpful;
  return total > 0 ? (helpful / total) * 100 : 0;
});

// Virtual for engagement score
reviewSchema.virtual('engagementScore').get(function() {
  return (this.stats.likes * 1) + 
         (this.stats.comments * 2) + 
         (this.stats.shares * 3) + 
         (this.stats.helpfulVotes * 1.5);
});

// Pre-save middleware to update stats
reviewSchema.pre('save', function(next) {
  this.stats.likes = this.likes.length;
  this.stats.comments = this.comments.length;
  this.stats.helpfulVotes = this.helpfulVotes.length;
  next();
});

// Method to add a comment
reviewSchema.methods.addComment = function(userId, content, parentCommentId = null) {
  const comment = {
    user: userId,
    content: content,
    isReply: !!parentCommentId,
    parentComment: parentCommentId
  };
  this.comments.push(comment);
  return this.save();
};

// Method to add a like
reviewSchema.methods.toggleLike = function(userId) {
  const existingLike = this.likes.find(like => like.user.toString() === userId.toString());
  
  if (existingLike) {
    this.likes.pull(existingLike._id);
  } else {
    this.likes.push({ user: userId });
  }
  
  return this.save();
};

// Method to add helpful vote
reviewSchema.methods.addHelpfulVote = function(userId, isHelpful) {
  // Remove existing vote from this user
  this.helpfulVotes = this.helpfulVotes.filter(
    vote => vote.user.toString() !== userId.toString()
  );
  
  // Add new vote
  this.helpfulVotes.push({
    user: userId,
    isHelpful: isHelpful
  });
  
  return this.save();
};

// Indexes for performance
reviewSchema.index({ user: 1 });
reviewSchema.index({ reviewType: 1 });
reviewSchema.index({ itinerary: 1 });
reviewSchema.index({ booking: 1 });
reviewSchema.index({ 'destination.name': 1, 'destination.country': 1 });
reviewSchema.index({ 'rating.overall': -1 });
reviewSchema.index({ visitDate: -1 });
reviewSchema.index({ createdAt: -1 });
reviewSchema.index({ moderationStatus: 1, isPublic: 1 });
reviewSchema.index({ tags: 1 });

module.exports = mongoose.model('Review', reviewSchema);