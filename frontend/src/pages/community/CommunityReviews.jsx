import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Rating,
  Avatar,
  Divider,
  Chip,
  Tab,
  Tabs,
  Paper,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  IconButton,
  Menu,
  MenuItem,
  Alert,
  Fab,
  Badge,
} from '@mui/material';
import {
  Add,
  Hotel,
  Flight,
  Tour,
  ThumbUp,
  ThumbDown,
  Share,
  Report,
  MoreVert,
  FilterList,
  Star,
  PhotoCamera,
  LocationOn,
  CalendarToday,
  Edit,
  Delete,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

const ReviewCard = ({ review, onLike, onReport, onEdit, onDelete, currentUserId }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [liked, setLiked] = useState(review.userLiked);
  const [likes, setLikes] = useState(review.likes);

  const handleLike = () => {
    setLiked(!liked);
    setLikes(prev => liked ? prev - 1 : prev + 1);
    onLike(review.id, !liked);
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'hotel': return <Hotel sx={{ fontSize: 20, color: 'rgba(10, 58, 100, 0.78)' }} />;
      case 'flight': return <Flight sx={{ fontSize: 20, color: 'rgba(10, 58, 100, 0.78)' }} />;
      case 'activity': return <Tour sx={{ fontSize: 20, color: 'rgba(10, 58, 100, 0.78)' }} />;
      default: return <Hotel sx={{ fontSize: 20, color: 'rgba(10, 58, 100, 0.78)' }} />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'hotel': return 'rgba(10, 58, 100, 0.78)';
      case 'flight': return 'rgba(10, 58, 100, 0.78)';
      case 'activity': return 'rgba(10, 58, 100, 0.78)';
      default: return 'rgba(10, 58, 100, 0.78)';
    }
  };

  return (
    <Card 
      sx={{ 
        background: 'white',
        border: '1px solid #E5E7EB',
        borderRadius: 2,
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.2s ease',
        '&:hover': { 
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        }
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            <Avatar
              src={review.userAvatar}
              sx={{ 
                width: 48, 
                height: 48, 
                mr: 2,
                bgcolor: 'rgba(10, 58, 100, 0.78)',
                fontSize: '1.1rem',
                fontWeight: 600,
              }}
            >
              {review.userName.charAt(0)}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 600, 
                    mr: 2,
                    color: '#1F2937',
                    fontSize: '1rem',
                  }}
                >
                  {review.userName}
                </Typography>
                <Chip
                  icon={getTypeIcon(review.type)}
                  label={review.type.charAt(0).toUpperCase() + review.type.slice(1)}
                  size="small"
                  variant="outlined"
                  sx={{
                    borderColor: getTypeColor(review.type),
                    color: getTypeColor(review.type),
                    bgcolor: `${getTypeColor(review.type)}10`,
                    fontWeight: 600,
                    '&:hover': {
                      bgcolor: `${getTypeColor(review.type)}20`,
                    }
                  }}
                />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                <Rating 
                  value={review.rating} 
                  readOnly 
                  size="small" 
                  sx={{ 
                    mr: 1,
                    '& .MuiRating-iconFilled': {
                      color: '#FFC107',
                    }
                  }} 
                />
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                  {new Date(review.date).toLocaleDateString()}
                </Typography>
              </Box>
            </Box>
          </Box>
          <IconButton 
            onClick={handleMenuClick}
            size="small"
            sx={{
              color: '#6B7280',
              '&:hover': {
                bgcolor: '#F3F4F6',
              }
            }}
          >
            <MoreVert />
          </IconButton>
        </Box>

        <Typography 
          variant="h6" 
          sx={{ 
            mb: 2, 
            fontWeight: 600,
            color: '#1F2937',
            fontSize: '1.125rem',
            lineHeight: 1.4,
          }}
        >
          {review.title}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <LocationOn sx={{ fontSize: 16, mr: 0.5, color: '#6B7280' }} />
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
              {review.location}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CalendarToday sx={{ fontSize: 16, mr: 0.5, color: '#6B7280' }} />
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
              Visited {review.visitDate}
            </Typography>
          </Box>
        </Box>

        <Typography 
          variant="body1" 
          sx={{ 
            mb: 3, 
            lineHeight: 1.6,
            color: '#4B5563',
            fontSize: '0.95rem',
          }}
        >
          {review.content}
        </Typography>

        {/* Tags */}
        {review.tags && review.tags.length > 0 && (
          <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
            {review.tags.map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                size="small"
                sx={{
                  bgcolor: '#EFF6FF',
                  color: '#1E40AF',
                  fontSize: '0.75rem',
                  height: 24,
                  border: 'none',
                  '&:hover': {
                    bgcolor: '#DBEAFE',
                  }
                }}
              />
            ))}
          </Box>
        )}

        <Divider sx={{ mb: 3 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              startIcon={<ThumbUp />}
              onClick={handleLike}
              variant={liked ? 'contained' : 'outlined'}
              size="small"
              sx={liked ? {
                bgcolor: 'rgba(10, 58, 100, 0.78)',
                color: 'white',
                fontSize: '0.875rem',
                fontWeight: 500,
                borderRadius: 2,
                px: 2,
                py: 0.5,
                textTransform: 'none',
                '&:hover': {
                  bgcolor: 'rgba(10, 58, 100, 0.78)',
                }
              } : {
                borderColor: 'rgba(10, 58, 100, 0.78)',
                color: 'rgba(10, 58, 100, 0.78)',
                fontSize: '0.875rem',
                fontWeight: 500,
                borderRadius: 2,
                px: 2,
                py: 0.5,
                textTransform: 'none',
                '&:hover': {
                  borderColor: 'rgba(10, 58, 100, 0.78)',
                  bgcolor: 'rgba(10, 58, 100, 0.78)',
                  color: 'white',
                }
              }}
            >
              {likes}
            </Button>
            <Button
              startIcon={<Share />}
              variant="outlined"
              size="small"
              sx={{
                borderColor: 'rgba(10, 58, 100, 0.78)',
                color: 'rgba(10, 58, 100, 0.78)',
                fontSize: '0.875rem',
                fontWeight: 500,
                borderRadius: 2,
                px: 2,
                py: 0.5,
                textTransform: 'none',
                '&:hover': {
                  borderColor: 'rgba(10, 58, 100, 0.78)',
                  bgcolor: 'rgba(10, 58, 100, 0.78)',
                  color: 'white',
                }
              }}
            >
              Share
            </Button>
          </Box>
          <Typography 
            variant="caption" 
            color="text.secondary"
            sx={{ 
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              color: '#6B7280',
            }}
          >
            <Star sx={{ fontSize: 14, color: 'rgba(10, 58, 100, 0.78)' }} />
            {review.helpful} people found this helpful
          </Typography>
        </Box>
      </CardContent>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(100, 181, 246, 0.1)',
            borderRadius: 2,
          }
        }}
      >
        {currentUserId === review.userId ? (
          [
            <MenuItem key="edit" onClick={() => { onEdit(review); handleMenuClose(); }}>
              <Edit sx={{ mr: 1, fontSize: 20 }} />
              Edit Review
            </MenuItem>,
            <MenuItem key="delete" onClick={() => { onDelete(review); handleMenuClose(); }} sx={{ color: 'error.main' }}>
              <Delete sx={{ mr: 1, fontSize: 20 }} />
              Delete Review
            </MenuItem>
          ]
        ) : (
          <MenuItem onClick={() => { onReport(review); handleMenuClose(); }}>
            <Report sx={{ mr: 1, fontSize: 20 }} />
            Report Review
          </MenuItem>
        )}
      </Menu>
    </Card>
  );
};

const AddReviewDialog = ({ open, onClose, onSubmit, type = 'hotel' }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    rating: 5,
    location: '',
    visitDate: '',
    tags: [],
  });

  const handleSubmit = () => {
    onSubmit({ ...formData, type });
    onClose();
    setFormData({
      title: '',
      content: '',
      rating: 5,
      location: '',
      visitDate: '',
      tags: [],
    });
  };

  const handleTagAdd = (event) => {
    if (event.key === 'Enter' && event.target.value) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, event.target.value.trim()]
      }));
      event.target.value = '';
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
        }
      }}
    >
      <DialogTitle sx={{ 
        pb: 2, 
        fontSize: '1.25rem', 
        fontWeight: 600,
        color: '#1F2937',
        borderBottom: '1px solid #E5E7EB'
      }}>
        Write a Review
      </DialogTitle>
      <DialogContent sx={{ pt: 3 }}>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Review Title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Summarize your experience"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '& fieldset': {
                    borderColor: '#D1D5DB',
                  },
                  '&:hover fieldset': {
                    borderColor: '#9CA3AF',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#2563EB',
                  },
                }
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Location"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              placeholder="Where did you visit?"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '& fieldset': {
                    borderColor: '#D1D5DB',
                  },
                  '&:hover fieldset': {
                    borderColor: '#9CA3AF',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#2563EB',
                  },
                }
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Rating
              </Typography>
              <Rating
                value={formData.rating}
                onChange={(event, newValue) => {
                  setFormData(prev => ({ ...prev, rating: newValue }));
                }}
                size="large"
              />
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Visit Date"
              type="date"
              value={formData.visitDate}
              onChange={(e) => setFormData(prev => ({ ...prev, visitDate: e.target.value }))}
              InputLabelProps={{ shrink: true }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '& fieldset': {
                    borderColor: '#D1D5DB',
                  },
                  '&:hover fieldset': {
                    borderColor: '#9CA3AF',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#2563EB',
                  },
                }
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Your Review"
              multiline
              rows={4}
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Share your experience, what you liked, tips for other travelers..."
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '& fieldset': {
                    borderColor: '#D1D5DB',
                  },
                  '&:hover fieldset': {
                    borderColor: '#9CA3AF',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#2563EB',
                  },
                }
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Tags (press Enter to add)"
              placeholder="e.g., family-friendly, romantic, budget, luxury"
              onKeyPress={handleTagAdd}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '& fieldset': {
                    borderColor: '#D1D5DB',
                  },
                  '&:hover fieldset': {
                    borderColor: '#9CA3AF',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#2563EB',
                  },
                }
              }}
            />
            <Box sx={{ mt: 1 }}>
              {formData.tags.map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  onDelete={() => {
                    setFormData(prev => ({
                      ...prev,
                      tags: prev.tags.filter((_, i) => i !== index)
                    }));
                  }}
                  sx={{ 
                    mr: 0.5, 
                    mb: 0.5,
                    bgcolor: '#EFF6FF',
                    color: '#1E40AF',
                    fontSize: '0.875rem',
                    '& .MuiChip-deleteIcon': {
                      color: '#6B7280',
                      '&:hover': {
                        color: '#374151',
                      }
                    }
                  }}
                />
              ))}
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ 
        p: 3, 
        borderTop: '1px solid #E5E7EB',
        gap: 1
      }}>
        <Button 
          onClick={onClose}
          variant="outlined"
          sx={{
            borderColor: '#D1D5DB',
            color: '#6B7280',
            textTransform: 'none',
            fontWeight: 500,
            '&:hover': {
              borderColor: '#9CA3AF',
              bgcolor: '#F9FAFB',
            }
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!formData.title || !formData.content || !formData.rating}
          sx={{
            bgcolor: '#2563EB',
            color: 'white',
            textTransform: 'none',
            fontWeight: 500,
            '&:hover': {
              bgcolor: '#1D4ED8',
            },
            '&.Mui-disabled': {
              bgcolor: '#D1D5DB',
              color: '#9CA3AF',
            }
          }}
        >
          Submit Review
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const CommunityReviews = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [addReviewOpen, setAddReviewOpen] = useState(false);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [ratingFilter, setRatingFilter] = useState(0);
  const { user } = useAuth();

  // Mock reviews data
  useEffect(() => {
    const mockReviews = [
      {
        id: 1,
        type: 'hotel',
        userId: 'user1',
        userName: 'Sarah Johnson',
        userAvatar: '',
        title: 'Amazing stay at Grand Plaza Hotel',
        content: 'Had an incredible stay at this hotel! The service was exceptional, room was spacious and clean. The location is perfect for exploring the city. Staff was very helpful and the breakfast buffet was amazing. Highly recommend this place for anyone visiting Tokyo.',
        rating: 5,
        location: 'Tokyo, Japan',
        visitDate: '2025-09-15',
        date: '2025-09-18',
        likes: 24,
        helpful: 18,
        userLiked: false,
        tags: ['luxury', 'excellent-service', 'great-location'],
        photos: []
      },
      {
        id: 2,
        type: 'activity',
        userId: 'user2',
        userName: 'Mike Chen',
        userAvatar: '',
        title: 'Best food tour in Tokyo!',
        content: 'This food tour exceeded all my expectations! Our guide was knowledgeable and passionate about Japanese cuisine. We tried so many different local foods I never would have found on my own. The small group size made it personal and fun. A must-do experience!',
        rating: 5,
        location: 'Tokyo, Japan',
        visitDate: '2025-09-10',
        date: '2025-09-12',
        likes: 31,
        helpful: 25,
        userLiked: true,
        tags: ['food', 'authentic', 'expert-guide', 'small-group'],
        photos: []
      },
      {
        id: 3,
        type: 'flight',
        userId: 'user3',
        userName: 'Emily Davis',
        userAvatar: '',
        title: 'Comfortable flight with excellent service',
        content: 'JAL provided excellent service on this international flight. The seats were comfortable, entertainment system was great, and the crew was very attentive. Food was surprisingly good for airline food. Flight was on time and boarding process was smooth.',
        rating: 4,
        location: 'Tokyo to New York',
        visitDate: '2025-09-05',
        date: '2025-09-06',
        likes: 12,
        helpful: 8,
        userLiked: false,
        tags: ['comfortable', 'on-time', 'good-food', 'friendly-crew'],
        photos: []
      },
    ];
    setReviews(mockReviews);
  }, []);

  const tabs = [
    { label: 'All Reviews', value: 'all' },
    { label: 'Hotels', value: 'hotel' },
    { label: 'Flights', value: 'flight' },
    { label: 'Activities', value: 'activity' },
    { label: 'My Reviews', value: 'my-reviews' },
  ];

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const filterReviews = () => {
    let filtered = reviews;
    
    // Filter by tab
    const tabValue = tabs[activeTab].value;
    if (tabValue === 'my-reviews') {
      filtered = filtered.filter(review => review.userId === user?.id);
    } else if (tabValue !== 'all') {
      filtered = filtered.filter(review => review.type === tabValue);
    }
    
    // Filter by rating
    if (ratingFilter > 0) {
      filtered = filtered.filter(review => review.rating >= ratingFilter);
    }
    
    return filtered;
  };

  const handleAddReview = (reviewData) => {
    const newReview = {
      ...reviewData,
      id: reviews.length + 1,
      userId: user?.id || 'current-user',
      userName: user?.name || 'Current User',
      userAvatar: user?.avatar || '',
      date: new Date().toISOString().split('T')[0],
      likes: 0,
      helpful: 0,
      userLiked: false,
      photos: [],
    };
    setReviews(prev => [newReview, ...prev]);
  };

  const handleLikeReview = (reviewId, liked) => {
    setReviews(prev => prev.map(review =>
      review.id === reviewId
        ? { ...review, userLiked: liked, likes: liked ? review.likes + 1 : review.likes - 1 }
        : review
    ));
  };

  const handleEditReview = (review) => {
    console.log('Edit review:', review);
    // Open edit dialog
  };

  const handleDeleteReview = (review) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      setReviews(prev => prev.filter(r => r.id !== review.id));
    }
  };

  const handleReportReview = (review) => {
    console.log('Report review:', review);
    // Open report dialog
  };

  const filteredReviews = filterReviews();

  const stats = [
    {
      value: reviews.length,
      label: 'Total Reviews',
      color: '#64B5F6',
      icon: <Star />,
    },
    {
      value: (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1),
      label: 'Average Rating',
      color: '#42A5F5',
      icon: <Star />,
    },
    {
      value: reviews.reduce((sum, r) => sum + r.likes, 0),
      label: 'Total Likes',
      color: '#90CAF9',
      icon: <ThumbUp />,
    },
    {
      value: reviews.filter(r => r.userId === user?.id).length,
      label: 'Your Reviews',
      color: '#64B5F6',
      icon: <Edit />,
    },
  ];

  return (
    <Box sx={{ minHeight: '100vh' }}>
      {/* Hero Section */}
      <Box
        sx={{
          minHeight: '80vh',
          background: `
            linear-gradient(135deg, rgba(10, 58, 100, 0.85) 0%, rgba(10, 58, 100, 0.78) 50%, rgba(13, 72, 161, 0.8) 100%),
            url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')
          `,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          clipPath: 'polygon(0 0, 100% 0, 100% 85%, 0 100%)',
          pt: 10,
          pb: 15,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.3) 0%, rgba(10, 58, 100, 0.2) 100%)',
            zIndex: 1,
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 30% 70%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)',
            zIndex: 1,
          }
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 3 }}>
          <Box sx={{ textAlign: 'center', color: 'white' }}>
            <Typography 
              variant="h1" 
              component="h1" 
              gutterBottom 
              sx={{ 
                fontWeight: 900,
                letterSpacing: '2px',
                mb: 3,
                fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
                textShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                background: 'linear-gradient(45deg, #fff, #f0f8ff)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Community Reviews
            </Typography>
            <Typography 
              variant="h4" 
              sx={{ 
                mb: 6,
                fontWeight: 300,
                letterSpacing: '1px',
                opacity: 0.95,
                maxWidth: { xs: '100%', sm: 700, md: 900 },
                mx: 'auto',
                lineHeight: 1.5,
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
                fontSize: { xs: '1.2rem', sm: '1.5rem', md: '1.8rem' },
              }}
            >
              Discover authentic travel experiences through our global community of explorers
            </Typography>

            {/* Statistics Boxes */}
            <Grid container spacing={2} sx={{ mt: 6, justifyContent: 'center', maxWidth: 600, mx: 'auto' }}>
              {stats.map((stat, index) => (
                <Grid item xs={6} sm={3} key={index} sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Paper 
                    elevation={0}
                    sx={{ 
                      p: 2, 
                      textAlign: 'center',
                      background: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: 3,
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                      transition: 'all 0.3s ease',
                      height: 120,
                      width: 120,
                      minWidth: 120,
                      maxWidth: 120,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      '&:hover': { 
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.15)',
                      }
                    }}
                  >
                    <Avatar 
                      sx={{ 
                        bgcolor: '#64B5F6',
                        mx: 'auto', 
                        mb: 1,
                        width: 32,
                        height: 32,
                      }}
                    >
                      {React.cloneElement(stat.icon, { sx: { fontSize: 16 } })}
                    </Avatar>
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        fontWeight: 700,
                        color: '#2D3748',
                        mb: 0.5,
                        fontSize: '1.25rem',
                      }}
                    >
                      {stat.value}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ fontWeight: 500, fontSize: '0.75rem' }}
                    >
                      {stat.label}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>

            {/* Action Button */}
            <Box sx={{ mt: 6, textAlign: 'center' }}>
              <Button
                variant="contained"
                size="medium"
                startIcon={<Add />}
                onClick={() => setAddReviewOpen(true)}
                sx={{
                  py: 1.5,
                  px: 4,
                  fontSize: '1rem',
                  fontWeight: 600,
                  borderRadius: 2,
                  background: 'rgba(255, 255, 255, 0.95)',
                  color: 'rgba(10, 58, 100, 0.78)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                  textTransform: 'none',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.2)',
                    background: 'rgba(255, 255, 255, 1)',
                  },
                }}
              >
                Write Review
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: 8, mt: -6, position: 'relative', zIndex: 3 }}>
        {/* Header Controls */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 4,
          flexWrap: 'wrap',
          gap: 2,
        }}>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 700,
              letterSpacing: '0.5px',
              color: '#1A202C',
            }}
          >
            Browse Reviews
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton
              onClick={(e) => setFilterAnchorEl(e.currentTarget)}
              sx={{ 
                background: 'rgba(255, 255, 255, 0.9)',
                border: '2px solid rgba(10, 58, 100, 0.78)',
                borderRadius: 2,
                '&:hover': {
                  background: 'rgba(10, 58, 100, 0.78)',
                  '& svg': { color: 'white' }
                }
              }}
            >
              <FilterList sx={{ color: 'rgba(10, 58, 100, 0.78)', transition: 'color 0.3s ease' }} />
            </IconButton>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setAddReviewOpen(true)}
              size="medium"
              sx={{
                background: 'rgba(10, 58, 100, 0.78)',
                borderRadius: 2,
                px: 3,
                py: 1,
                fontWeight: 500,
                fontSize: '0.9rem',
                textTransform: 'none',
                boxShadow: '0 4px 12px rgba(10, 58, 100, 0.3)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'rgba(10, 58, 100, 0.9)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(10, 58, 100, 0.4)',
                }
              }}
            >
            Write Review
            </Button>
          </Box>
        </Box>

        {/* Tabs */}
        <Box sx={{ mb: 4 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              borderBottom: '1px solid #E5E7EB',
              '& .MuiTab-root': {
                fontWeight: 500,
                textTransform: 'none',
                fontSize: '0.875rem',
                py: 2,
                px: 3,
                color: '#6B7280',
                minHeight: 48,
                minWidth: 'auto',
                transition: 'all 0.2s ease',
                '&:hover': {
                  color: 'rgba(10, 58, 100, 0.8)',
                },
                '&.Mui-selected': {
                  color: 'rgba(10, 58, 100, 0.78)',
                  fontWeight: 600,
                }
              },
              '& .MuiTabs-indicator': {
                background: 'rgba(10, 58, 100, 0.78)',
                height: 2,
              },
              '& .MuiTabs-flexContainer': {
                gap: 1,
              }
            }}
          >
            {tabs.map((tab, index) => (
              <Tab 
                key={index} 
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <span>{tab.label}</span>
                    <Box
                      sx={{
                        minWidth: 20,
                        height: 20,
                        borderRadius: '50%',
                        background: 'rgba(10, 58, 100, 0.78)',
                        color: 'white',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {tab.value === 'my-reviews' 
                        ? reviews.filter(r => r.userId === user?.id).length 
                        : tab.value === 'all' 
                          ? reviews.length 
                          : reviews.filter(r => r.type === tab.value).length}
                    </Box>
                  </Box>
                } 
              />
            ))}
          </Tabs>
        </Box>

        {/* Reviews List */}
        {filteredReviews.length > 0 ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {filteredReviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                onLike={handleLikeReview}
                onEdit={handleEditReview}
                onDelete={handleDeleteReview}
                onReport={handleReportReview}
                currentUserId={user?.id}
              />
            ))}
          </Box>
        ) : (
          <Paper 
            elevation={0}
            sx={{ 
              p: 6, 
              textAlign: 'center',
              background: 'white',
              border: '1px solid #E5E7EB',
              borderRadius: 2,
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            }}
          >
            <Avatar
              sx={{
                width: 64,
                height: 64,
                mx: 'auto',
                mb: 3,
                bgcolor: '#F3F4F6',
                color: '#6B7280',
              }}
            >
              <Star sx={{ fontSize: 32 }} />
            </Avatar>
            <Typography 
              variant="h6" 
              color="text.primary"
              sx={{ 
                mb: 2,
                fontWeight: 600,
                color: '#1F2937',
              }}
            >
              No reviews found
            </Typography>
            <Typography 
              variant="body1" 
              color="text.secondary" 
              sx={{ 
                mb: 4, 
                lineHeight: 1.6,
                color: '#6B7280',
              }}
            >
              Be the first to share your travel experience and help fellow travelers!
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setAddReviewOpen(true)}
              size="medium"
              sx={{
                bgcolor: '#2563EB',
                color: 'white',
                borderRadius: 2,
                px: 4,
                py: 1.5,
                fontWeight: 500,
                textTransform: 'none',
                fontSize: '0.95rem',
                '&:hover': {
                  bgcolor: '#1D4ED8',
                },
              }}
            >
              Write First Review
            </Button>
          </Paper>
        )}

        {/* Filter Menu */}
        <Menu
          anchorEl={filterAnchorEl}
          open={Boolean(filterAnchorEl)}
          onClose={() => setFilterAnchorEl(null)}
          PaperProps={{
            sx: {
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(100, 181, 246, 0.1)',
              borderRadius: 2,
            }
          }}
        >
          <MenuItem onClick={() => { setRatingFilter(0); setFilterAnchorEl(null); }}>
            All Ratings
          </MenuItem>
          <MenuItem onClick={() => { setRatingFilter(5); setFilterAnchorEl(null); }}>
            5 Stars Only
          </MenuItem>
          <MenuItem onClick={() => { setRatingFilter(4); setFilterAnchorEl(null); }}>
            4+ Stars
          </MenuItem>
          <MenuItem onClick={() => { setRatingFilter(3); setFilterAnchorEl(null); }}>
            3+ Stars
          </MenuItem>
        </Menu>

        {/* Add Review Dialog */}
        <AddReviewDialog
          open={addReviewOpen}
          onClose={() => setAddReviewOpen(false)}
          onSubmit={handleAddReview}
          type={tabs[activeTab].value !== 'all' && tabs[activeTab].value !== 'my-reviews' ? tabs[activeTab].value : 'hotel'}
        />
      </Container>
    </Box>
  );
};

export default CommunityReviews;

