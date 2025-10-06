import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  Grid,
  Chip,
  Rating,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
} from '@mui/material';
import {
  Search,
  LocationOn,
  Schedule,
  Person,
  Star,
  Close,
  CheckCircle,
  Tour as TourIcon,
  Restaurant,
  CameraAlt,
  DirectionsWalk,
  Group,
  AccessTime,
  Cancel,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { bookingService } from '../../services/bookingService';

const ActivityCard = ({ activity, onBook, onViewDetails }) => {
  const getCategoryIcon = (category) => {
    const iconMap = {
      'Tours': <TourIcon />,
      'Food & Drink': <Restaurant />,
      'Photography': <CameraAlt />,
      'Walking Tours': <DirectionsWalk />,
    };
    return iconMap[category] || <TourIcon />;
  };

  const getCategoryColor = (category) => {
    const colorMap = {
      'Tours': 'primary',
      'Food & Drink': 'secondary',
      'Photography': 'success',
      'Walking Tours': 'info',
    };
    return colorMap[category] || 'default';
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', transition: 'all 0.3s ease', '&:hover': { boxShadow: 6 } }}>
      <CardMedia
        component="img"
        height="200"
        image={activity.image}
        alt={activity.name}
      />
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ mb: 2 }}>
          <Chip
            icon={getCategoryIcon(activity.category)}
            label={activity.category}
            color={getCategoryColor(activity.category)}
            size="small"
            sx={{ mb: 1 }}
          />
          <Typography gutterBottom variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
            {activity.name}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Rating value={activity.rating} readOnly size="small" />
          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
            ({activity.reviews} reviews)
          </Typography>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
          {activity.description}
        </Typography>

        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Schedule sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              Duration: {activity.duration}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Group sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              Max {activity.maxCapacity} people
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <LocationOn sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {activity.meetingPoint}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
          <Box>
            <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold' }}>
              ${activity.price}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              per person
            </Typography>
          </Box>
          <Box>
            <Button
              variant="outlined"
              size="small"
              onClick={() => onViewDetails(activity)}
              sx={{ mr: 1 }}
            >
              Details
            </Button>
            <Button
              variant="contained"
              size="small"
              onClick={() => onBook(activity)}
            >
              Book Now
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

const ActivityDetailsModal = ({ activity, open, onClose }) => (
  <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
    <DialogTitle>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5">{activity?.name}</Typography>
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </Box>
    </DialogTitle>
    <DialogContent>
      {activity && (
        <Box>
          <img
            src={activity.image}
            alt={activity.name}
            style={{
              width: '100%',
              height: '300px',
              objectFit: 'cover',
              borderRadius: '8px',
              marginBottom: '16px',
            }}
          />
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                About this experience
              </Typography>
              <Typography variant="body1" sx={{ mb: 3 }}>
                {activity.description}
              </Typography>
              
              <Typography variant="h6" sx={{ mb: 2 }}>
                What's included
              </Typography>
              <List dense>
                {activity.includes.map((item, index) => (
                  <ListItem key={index} sx={{ py: 0.5 }}>
                    <ListItemIcon>
                      <CheckCircle color="success" sx={{ fontSize: 20 }} />
                    </ListItemIcon>
                    <ListItemText primary={item} />
                  </ListItem>
                ))}
              </List>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Activity Details
                </Typography>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                    <Schedule sx={{ fontSize: 16, mr: 1, verticalAlign: 'text-bottom' }} />
                    Duration
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {activity.duration}
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                    <Group sx={{ fontSize: 16, mr: 1, verticalAlign: 'text-bottom' }} />
                    Group Size
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Maximum {activity.maxCapacity} participants
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                    <LocationOn sx={{ fontSize: 16, mr: 1, verticalAlign: 'text-bottom' }} />
                    Meeting Point
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {activity.meetingPoint}
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                    <AccessTime sx={{ fontSize: 16, mr: 1, verticalAlign: 'text-bottom' }} />
                    Availability
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {activity.availability}
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                    <Cancel sx={{ fontSize: 16, mr: 1, verticalAlign: 'text-bottom' }} />
                    Cancellation
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {activity.cancellationPolicy}
                  </Typography>
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold' }}>
                    ${activity.price}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    per person
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      )}
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Close</Button>
      <Button variant="contained">Book This Experience</Button>
    </DialogActions>
  </Dialog>
);

const ActivityBooking = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useState({
    destination: 'Tokyo, Japan',
    date: '2025-10-15',
    category: '',
  });
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);

  const { user } = useAuth();

  const categories = [
    'All Categories',
    'Tours',
    'Food & Drink',
    'Photography',
    'Walking Tours',
    'Cultural Experiences',
    'Adventure',
    'Museums',
    'Entertainment',
    'Shopping',
  ];

  useEffect(() => {
    searchActivities();
  }, []);

  const searchActivities = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await bookingService.searchActivities(
        searchParams.destination,
        searchParams.date || null,
        searchParams.category || null
      );

      if (result.success) {
        setActivities(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to search activities. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBookActivity = (activity) => {
    setSelectedActivity(activity);
    setBookingModalOpen(true);
  };

  const handleViewDetails = (activity) => {
    setSelectedActivity(activity);
    setDetailsModalOpen(true);
  };

  const handleBookingConfirm = async () => {
    try {
      const result = await bookingService.bookActivity(selectedActivity.id, {
        activityName: selectedActivity.name,
        date: searchParams.date,
        participants: 1,
        totalPrice: selectedActivity.price,
      });

      if (result.success) {
        // Handle successful booking
        setBookingModalOpen(false);
        console.log('Activity booked successfully:', result.booking);
      }
    } catch (error) {
      console.error('Booking failed:', error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
          <TourIcon sx={{ mr: 2 }} />
          Activity & Experience Booking
        </Typography>
        
        {/* Search Form */}
        <Card sx={{ p: 3, mb: 4 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Destination"
                value={searchParams.destination}
                onChange={(e) => setSearchParams({ ...searchParams, destination: e.target.value })}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationOn />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Date (Optional)"
                type="date"
                value={searchParams.date}
                onChange={(e) => setSearchParams({ ...searchParams, date: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={searchParams.category}
                  label="Category"
                  onChange={(e) => setSearchParams({ ...searchParams, category: e.target.value })}
                >
                  {categories.map((category) => (
                    <MenuItem key={category} value={category === 'All Categories' ? '' : category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={searchActivities}
                startIcon={<Search />}
                disabled={loading}
                sx={{ height: 56 }}
              >
                Search
              </Button>
            </Grid>
          </Grid>
        </Card>

        {/* Loading */}
        {loading && (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        )}

        {/* Error */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Results */}
        {activities.length > 0 && (
          <>
            <Typography variant="h6" sx={{ mb: 2 }}>
              {activities.length} experiences found
            </Typography>
            <Grid container spacing={3}>
              {activities.map((activity) => (
                <Grid item xs={12} sm={6} md={4} key={activity.id}>
                  <ActivityCard
                    activity={activity}
                    onBook={handleBookActivity}
                    onViewDetails={handleViewDetails}
                  />
                </Grid>
              ))}
            </Grid>
          </>
        )}

        {/* Activity Details Modal */}
        <ActivityDetailsModal
          activity={selectedActivity}
          open={detailsModalOpen}
          onClose={() => setDetailsModalOpen(false)}
        />

        {/* Simple Booking Confirmation Modal */}
        <Dialog
          open={bookingModalOpen}
          onClose={() => setBookingModalOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Confirm Booking</DialogTitle>
          <DialogContent>
            {selectedActivity && (
              <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  {selectedActivity.name}
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2">Date</Typography>
                    <Typography variant="body2">{searchParams.date}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2">Duration</Typography>
                    <Typography variant="body2">{selectedActivity.duration}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2">Participants</Typography>
                    <Typography variant="body2">1 person</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2">Total Price</Typography>
                    <Typography variant="h6" color="primary">
                      ${selectedActivity.price}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            )}
            <Typography variant="body2" sx={{ mt: 2, textAlign: 'center', color: 'text.secondary' }}>
              Complete booking flow would include guest details and payment processing.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setBookingModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleBookingConfirm}
            >
              Confirm Booking
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default ActivityBooking;