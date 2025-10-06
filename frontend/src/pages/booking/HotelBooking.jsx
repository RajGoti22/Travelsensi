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
  Stepper,
  Step,
  StepLabel,
  Paper,
  Divider,
  IconButton,
  Badge,
} from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import {
  Search,
  LocationOn,
  CalendarToday,
  Person,
  Star,
  Wifi,
  Pool,
  Restaurant,
  FitnessCenter,
  Spa,
  Close,
  CreditCard,
  CheckCircle,
  Hotel as HotelIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { bookingService } from '../../services/bookingService';
import HotelDetailsModal from './HotelDetailsModal';

const HotelCard = ({ hotel, onBook, onViewDetails }) => {
  const getAmenityIcon = (amenity) => {
    const iconMap = {
      'Free WiFi': <Wifi fontSize="small" />,
      'Swimming Pool': <Pool fontSize="small" />,
      'Pool': <Pool fontSize="small" />,
      'Restaurant': <Restaurant fontSize="small" />,
      'Gym': <FitnessCenter fontSize="small" />,
      'Fitness Center': <FitnessCenter fontSize="small" />,
      'Spa': <Spa fontSize="small" />,
      'Rooftop Pool': <Pool fontSize="small" />,
      'Indoor Pool': <Pool fontSize="small" />,
    };
    return iconMap[amenity] || <Star fontSize="small" />;
  };

  return (
    <Paper
      elevation={2}
      sx={{
        height: { xs: 'auto', sm: 280 }, // Auto height on mobile, fixed on larger screens
        minHeight: { xs: 320, sm: 280 }, // Minimum height to ensure content fits
        width: '100%',
        maxWidth: { xs: '100%', sm: 'calc(100% - 32px)' }, // Full width on mobile
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' }, // Stack on mobile, horizontal on larger screens
        borderRadius: { xs: 2, sm: 3 }, // Smaller radius on mobile
        overflow: 'hidden',
        transition: 'all 0.2s ease-in-out',
        border: '1px solid #e5e7eb',
        backgroundColor: '#ffffff',
        m: { xs: 0.5, sm: 1.5 }, // Smaller margin on mobile
        '&:hover': {
          boxShadow: '0 12px 28px rgba(0,0,0,0.12)',
          transform: { xs: 'none', sm: 'translateY(-2px)' }, // No transform on mobile
        },
      }}
    >
      {/* Hotel Image - Rectangle format */}
      <Box 
        sx={{ 
          position: 'relative', 
          width: { xs: '100%', sm: '45%' }, // Full width on mobile, 45% on larger screens
          height: { xs: 180, sm: '100%' }, // Increased height on mobile
          flexShrink: 0,
          overflow: 'hidden',
        }}
      >
        <CardMedia
          component="img"
          image={hotel.image}
          alt={hotel.name}
          sx={{ 
            objectFit: 'cover',
            width: '100%',
            height: '100%',
            transition: 'transform 0.3s ease',
            '&:hover': {
              transform: 'scale(1.02)',
            },
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: { xs: 8, sm: 12 }, // Closer to edge on mobile
            right: { xs: 8, sm: 12 }, // Closer to edge on mobile
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderRadius: 2,
            px: { xs: 1, sm: 1.5 }, // Reduced padding on mobile
            py: 0.5,
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          }}
        >
          <Star sx={{ color: '#f59e0b', fontSize: { xs: 14, sm: 16 } }} /> {/* Smaller icon on mobile */}
          <Typography 
            variant="body2" 
            sx={{ 
              fontWeight: 600, 
              fontSize: { xs: '0.8rem', sm: '0.85rem' }, // Smaller font on mobile
              color: '#1f2937',
            }}
          >
            {hotel.rating}
          </Typography>
        </Box>
      </Box>

      {/* Content Area - Takes remaining space */}
      <Box sx={{ 
        p: { xs: 1.5, sm: 3 }, // Reduced padding on mobile
        flex: 1,
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'space-between',
        minWidth: 0, // Prevents overflow issues
      }}>
        {/* Hotel Basic Info */}
        <Box sx={{ mb: { xs: 1, sm: 2 } }}>
          <Typography
            variant="h6"
            component="h3"
            sx={{
              fontWeight: 600,
              mb: { xs: 0.5, sm: 1 }, // Reduced margin on mobile
              fontSize: { xs: '0.95rem', sm: '1.2rem' }, // Smaller font on mobile
              lineHeight: 1.3,
              color: '#111827',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {hotel.name}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: { xs: 0.5, sm: 1 } }}>
            <LocationOn sx={{ fontSize: { xs: 14, sm: 16 }, color: '#6b7280', mr: 0.5 }} />
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ 
                fontSize: { xs: '0.8rem', sm: '0.875rem' }, // Smaller font on mobile
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {hotel.location}
            </Typography>
          </Box>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              fontSize: { xs: '0.8rem', sm: '0.875rem' }, // Smaller font on mobile
              lineHeight: 1.4,
              display: '-webkit-box',
              WebkitLineClamp: { xs: 2, sm: 3 }, // More lines on larger screens
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              minHeight: { xs: '2.2em', sm: '3.5em' }, // Reduced min height on mobile
            }}
          >
            {hotel.description}
          </Typography>
        </Box>

        {/* Middle section with amenities */}
        <Box sx={{ mb: { xs: 1, sm: 2 } }}>
          <Typography
            variant="subtitle2"
            sx={{ 
              mb: { xs: 0.5, sm: 1 }, // Reduced margin on mobile
              fontWeight: 600, 
              color: '#374151', 
              fontSize: { xs: '0.75rem', sm: '0.8rem' }, // Smaller font on mobile
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            Amenities
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 0.3, sm: 0.5 } }}> {/* Smaller gap on mobile */}
            {hotel.amenities.slice(0, { xs: 2, sm: 4 }[0] || 3).map((amenity, index) => (
              <Chip
                key={index}
                label={amenity}
                size="small"
                icon={getAmenityIcon(amenity)}
                sx={{
                  backgroundColor: '#f3f4f6',
                  color: '#4b5563',
                  fontSize: { xs: '0.65rem', sm: '0.7rem' }, // Smaller font on mobile
                  height: { xs: 20, sm: 24 }, // Smaller height on mobile
                  '& .MuiChip-icon': { 
                    color: '#6b7280',
                    fontSize: { xs: '0.8rem', sm: '0.9rem' }, // Smaller icon on mobile
                  },
                  '& .MuiChip-label': {
                    px: { xs: 0.5, sm: 1 }, // Reduced padding on mobile
                  },
                }}
              />
            ))}
            {hotel.amenities.length > 3 && (
              <Chip
                label={`+${hotel.amenities.length - 3}`}
                size="small"
                sx={{
                  backgroundColor: '#e5e7eb',
                  color: '#6b7280',
                  fontSize: { xs: '0.65rem', sm: '0.7rem' }, // Smaller font on mobile
                  height: { xs: 20, sm: 24 }, // Smaller height on mobile
                }}
              />
            )}
          </Box>
        </Box>

        {/* Bottom section - Price and Actions */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' }, // Stack on mobile
          justifyContent: 'space-between', 
          alignItems: { xs: 'stretch', sm: 'center' }, // Stretch on mobile
          gap: { xs: 1.5, sm: 0 }, // Add gap on mobile
        }}>
          {/* Price Section */}
          <Box sx={{ 
            textAlign: { xs: 'left', sm: 'left' }, // Center text on mobile
          }}>
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1,mb: -1 }}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  color: '#1976d2',
                  lineHeight: 1,
                  fontSize: { xs: '1.2rem', sm: '1.5rem' }, // Smaller font on mobile
                }}
              >
                ${hotel.price}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  textDecoration: 'line-through',
                  color: '#9ca3af',
                  fontSize: { xs: '0.8rem', sm: '0.875rem' },
                   // Smaller font on mobile
                }}
              >
                ${hotel.originalPrice}
              </Typography>
            </Box>
            <Typography 
              variant="caption" 
              color="text.secondary" 
              sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem'}}} // Smaller font on mobile
            >
              per night
            </Typography>
          </Box>

          {/* Action Buttons */}
          <Box sx={{ 
            display: 'flex', 
            gap: { xs: 1, sm: 1 }, 
            ml: { xs: 0, sm: 2 }, // No left margin on mobile
            justifyContent: { xs: 'stretch', sm: 'flex-end' }, // Stretch buttons on mobile
          }}>
            <Button
              variant="outlined"
              size="small"
              onClick={() => onViewDetails(hotel)}
              sx={{
                flex: { xs: 1, sm: 'none' }, // Full width on mobile
                borderRadius: 2,
                fontWeight: 500,
                fontSize: { xs: '0.7rem', sm: '0.75rem' }, // Smaller font on mobile
                px: { xs: 1.5, sm: 2 }, // Reduced padding on mobile
                py: 1,
                borderColor: '#d1d5db',
                color: '#6b7280',
                textTransform: 'none',
                minWidth: { xs: 'auto', sm: 80 }, // Auto width on mobile
                '&:hover': {
                  borderColor: 'rgba(10, 58, 100, 0.78)',
                  backgroundColor: '#f8fafc',
                  color: 'rgba(10, 58, 100, 0.78)',
                },
              }}
            >
              Details
            </Button>
            <Button
              variant="contained"
              size="small"
              onClick={() => onBook(hotel)}
              sx={{
                flex: { xs: 1, sm: 'none' }, // Full width on mobile
                borderRadius: 2,
                fontWeight: 600,
                fontSize: { xs: '0.7rem', sm: '0.75rem' }, // Smaller font on mobile
                px: { xs: 1.5, sm: 2 }, // Reduced padding on mobile
                py: 1,
                backgroundColor: 'rgba(10, 58, 100, 0.78)',
                textTransform: 'none',
                minWidth: { xs: 'auto', sm: 100 }, // Auto width on mobile
                '&:hover': {
                  backgroundColor: 'rgba(10, 58, 100, 0.95)',
                },
              }}
            >
              Book Now
            </Button>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};


const BookingModal = ({ hotel, open, onClose, onConfirm, checkIn, checkOut, guests }) => {
  const [step, setStep] = useState(0);
  const [bookingData, setBookingData] = useState({
    guestName: '',
    email: '',
    phone: '',
    specialRequests: '',
    paymentMethod: 'credit-card',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    billingName: '',
  });
  const [loading, setLoading] = useState(false);
  const [hotelDetails, setHotelDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState(null);

  useEffect(() => {
    if (open && hotel) {
      fetchHotelDetails();
    }
    // eslint-disable-next-line
  }, [open, hotel]);

  const fetchHotelDetails = async () => {
    setDetailsLoading(true);
    setDetailsError(null);
    setHotelDetails(null);
    try {
      const result = await bookingService.getHotelDetails({
        hotel_id: hotel.id || hotel.hotel_id,
        checkin: checkIn,
        checkout: checkOut,
        guests: guests || 2,
      });
      if (result.success) {
        setHotelDetails(result.data);
      } else {
        setDetailsError(result.error);
      }
    } catch (err) {
      setDetailsError('Failed to fetch hotel details.');
    } finally {
      setDetailsLoading(false);
    }
  };

  const steps = ['Guest Details', 'Payment', 'Confirmation'];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      handleBooking();
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleBooking = async () => {
    setLoading(true);
    try {
      // Use real hotel details if available
      const bookingPayload = {
        ...bookingData,
        hotelName: hotelDetails?.hotel_name || hotel.name,
        checkIn: checkIn,
        checkOut: checkOut,
        guests: guests,
        totalPrice: hotelDetails?.price || hotel.totalPrice,
        hotelId: hotel.id || hotel.hotel_id,
      };
      const result = await bookingService.bookHotel(bookingPayload.hotelId, bookingPayload);

      if (result.success) {
        onConfirm(result.booking);
      } else {
        // Handle error
        console.error('Booking failed:', result.error);
      }
    } catch (error) {
      console.error('Booking error:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Guest Name"
                  value={bookingData.guestName}
                  onChange={(e) => setBookingData({ ...bookingData, guestName: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={bookingData.email}
                  onChange={(e) => setBookingData({ ...bookingData, email: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  value={bookingData.phone}
                  onChange={(e) => setBookingData({ ...bookingData, phone: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Special Requests"
                  multiline
                  rows={3}
                  value={bookingData.specialRequests}
                  onChange={(e) => setBookingData({ ...bookingData, specialRequests: e.target.value })}
                  placeholder="Early check-in, late checkout, room preferences, etc."
                />
              </Grid>
            </Grid>
          </Box>
        );
      case 1:
        return (
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Payment Method</InputLabel>
                  <Select
                    value={bookingData.paymentMethod}
                    label="Payment Method"
                    onChange={(e) => setBookingData({ ...bookingData, paymentMethod: e.target.value })}
                  >
                    <MenuItem value="credit-card">Credit Card</MenuItem>
                    <MenuItem value="paypal">PayPal</MenuItem>
                    <MenuItem value="apple-pay">Apple Pay</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              {bookingData.paymentMethod === 'credit-card' && (
                <>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Card Number"
                      value={bookingData.cardNumber}
                      onChange={(e) => setBookingData({ ...bookingData, cardNumber: e.target.value })}
                      placeholder="1234 5678 9012 3456"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <CreditCard />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Expiry Date"
                      value={bookingData.expiryDate}
                      onChange={(e) => setBookingData({ ...bookingData, expiryDate: e.target.value })}
                      placeholder="MM/YY"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="CVV"
                      value={bookingData.cvv}
                      onChange={(e) => setBookingData({ ...bookingData, cvv: e.target.value })}
                      placeholder="123"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Name on Card"
                      value={bookingData.billingName}
                      onChange={(e) => setBookingData({ ...bookingData, billingName: e.target.value })}
                    />
                  </Grid>
                </>
              )}
            </Grid>
          </Box>
        );
      case 2:
        return (
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <CheckCircle sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
            <Typography variant="h6" sx={{ mb: 2 }}>
              Booking Confirmed!
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Your booking has been successfully confirmed. You will receive a confirmation email shortly.
            </Typography>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Book {hotel?.name}</Typography>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        {hotel && (
          <>
            {/* Booking Summary */}
            <Paper sx={{ p: 2, mb: 3, bgcolor: 'grey.50' }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Hotel</Typography>
                  <Typography variant="body2">{hotel.name}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Dates</Typography>
                  <Typography variant="body2">
                    {hotel.checkIn} - {hotel.checkOut}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Guests</Typography>
                  <Typography variant="body2">{hotel.guests} guests</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Total Price</Typography>
                  <Typography variant="h6" color="primary">
                    ${hotel.totalPrice}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>

            {/* Stepper */}
            <Stepper activeStep={step} sx={{ mb: 3 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            {/* Step Content */}
            {renderStepContent(step)}
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        {step > 0 && step < steps.length - 1 && (
          <Button onClick={handleBack} disabled={loading}>
            Back
          </Button>
        )}
        {step < steps.length - 1 && (
          <Button
            onClick={handleNext}
            variant="contained"
            disabled={loading}
          >
            {step === steps.length - 2 ? 'Complete Booking' : 'Next'}
          </Button>
        )}
        {loading && <CircularProgress size={24} />}
      </DialogActions>
    </Dialog>
  );
};

const HotelBooking = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useState({
    destination: 'Mumbai',
    checkIn: '2025-10-15',
    checkOut: '2025-10-20',
    guests: 2,
  });
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const availableCities = [
    { name: 'Mumbai', state: 'Maharashtra', country: 'India' },
    { name: 'Agra', state: 'Uttar Pradesh', country: 'India' },
    { name: 'New Delhi', state: 'Delhi', country: 'India' },
    { name: 'Jaipur', state: 'Rajasthan', country: 'India' },
    { name: 'Bengaluru', state: 'Karnataka', country: 'India' },
  ];

  const { user } = useAuth();

  useEffect(() => {
    // Load hotels for the default city on mount
    searchHotels();
  }, []);

  const searchHotels = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await bookingService.searchHotels(
        searchParams.destination,
        searchParams.checkIn,
        searchParams.checkOut,
        searchParams.guests
      );
      if (result.success) {
        setHotels(result.data);
        if (result.data.length === 0) {
          setError(`No hotels found in ${searchParams.destination}. Try Mumbai, Agra, New Delhi, Jaipur, or Bengaluru.`);
        }
      } else {
        setError(result.error || 'Failed to search hotels');
      }
    } catch (err) {
      setError('Failed to search hotels. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDestinationChange = (value) => {
    setSearchParams({ ...searchParams, destination: value });
    setShowSuggestions(false);
  };

  const filteredCities = availableCities.filter(city =>
    city.name.toLowerCase().includes(searchParams.destination.toLowerCase())
  );

  const handleBookHotel = (hotel) => {
    setSelectedHotel(hotel);
    setBookingModalOpen(true);
  };

  const handleViewDetails = (hotel) => {
    setSelectedHotel(hotel);
    setDetailsModalOpen(true);
  };

  const handleBookingConfirm = (booking) => {
    setBookingModalOpen(false);
    // Handle successful booking (e.g., redirect to confirmation page)
    console.log('Booking confirmed:', booking);
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      backgroundColor: '#ffffff',
      py: { xs: 1, sm: 2, md: 4 }, // Reduced padding on mobile
    }}>
      <Container maxWidth="lg" sx={{ px: { xs: 1, sm: 2, md: 3 } }}> {/* Reduced container padding on mobile */}
        {/* Simple Professional Header */}
        <Box sx={{ mb: 5, textAlign: 'center' }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 600,
              mb: 1,
              color: '#1a1a1a',
              fontSize: { xs: '2rem', md: '2.5rem' },
            }}
          >
            Hotel Booking
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: '#666666',
              fontWeight: 400,
              fontSize: { xs: '1rem', md: '1.1rem' },
            }}
          >
            Find and book your perfect stay
          </Typography>
        </Box>

        {/* Clean Search Form */}
        <Paper
          elevation={1}
          sx={{
            mb: { xs: 2, md: 4 }, // Reduced margin on mobile
            p: { xs: 2, sm: 3, md: 4 }, // Reduced padding on mobile
            borderRadius: 2,
            border: '1px solid #e0e0e0',
          }}
        >
          <Grid container spacing={3}>
            {/* Destination */}
            <Grid item xs={12} md={3}>
              <Box sx={{ position: 'relative' }}>
                <Typography
                  variant="subtitle2"
                  sx={{ mb: 1, fontWeight: 600, color: '#333' }}
                >
                  Destination
                </Typography>
                <TextField
                  fullWidth
                  value={searchParams.destination}
                  onChange={(e) => handleDestinationChange(e.target.value)}
                  onFocus={() => setShowSuggestions(true)}
                  placeholder="Enter city name"
                  variant="outlined"
                  size="medium"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationOn color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1,
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#1976d2',
                      },
                    }
                  }}
                />
                
                {/* Simple City Suggestions */}
                {showSuggestions && filteredCities.length > 0 && (
                  <Paper
                    sx={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      right: 0,
                      zIndex: 1000,
                      mt: 1,
                      border: '1px solid #e0e0e0',
                      borderRadius: 1,
                      maxHeight: 200,
                      overflow: 'auto',
                    }}
                  >
                    {filteredCities.map((city) => (
                      <Box
                        key={city.name}
                        onClick={() => handleDestinationChange(city.name)}
                        sx={{
                          p: 2,
                          cursor: 'pointer',
                          '&:hover': { backgroundColor: '#f5f5f5' },
                          borderBottom: '1px solid #f0f0f0',
                        }}
                      >
                        <Typography variant="body1">
                          {city.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {city.state}, {city.country}
                        </Typography>
                      </Box>
                    ))}
                  </Paper>
                )}
              </Box>
            </Grid>

            {/* Check-in */}
            <Grid item xs={12} sm={6} md={2.5}>
              <Typography
                variant="subtitle2"
                sx={{ mb: 1, fontWeight: 600, color: '#333' }}
              >
                Check-in
              </Typography>
              <TextField
                fullWidth
                type="date"
                value={searchParams.checkIn}
                onChange={(e) => setSearchParams({ ...searchParams, checkIn: e.target.value })}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarToday color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 1,
                  }
                }}
              />
            </Grid>

            {/* Check-out */}
            <Grid item xs={12} sm={6} md={2.5}>
              <Typography
                variant="subtitle2"
                sx={{ mb: 1, fontWeight: 600, color: '#333' }}
              >
                Check-out
              </Typography>
              <TextField
                fullWidth
                type="date"
                value={searchParams.checkOut}
                onChange={(e) => setSearchParams({ ...searchParams, checkOut: e.target.value })}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarToday color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 1,
                  }
                }}
              />
            </Grid>

            {/* Guests */}
            <Grid item xs={6} md={2}>
              <Typography
                variant="subtitle2"
                sx={{ mb: 1, fontWeight: 600, color: '#333' }}
              >
                Guests
              </Typography>
              <TextField
                fullWidth
                type="number"
                value={searchParams.guests}
                onChange={(e) => setSearchParams({ ...searchParams, guests: parseInt(e.target.value) || 1 })}
                inputProps={{ min: 1, max: 10 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 1,
                  }
                }}
              />
            </Grid>

            {/* Search Button */}
            <Grid item xs={6} md={2}>
              <Typography
                variant="subtitle2"
                sx={{ mb: 1, fontWeight: 600, color: 'transparent' }}
              >
                Search
              </Typography>
              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={searchHotels}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Search />}
                sx={{
                  py: 1.5,
                  borderRadius: 1,
                  fontWeight: 600,
                  backgroundColor: '#1976d2',
                  '&:hover': {
                    backgroundColor: '#1565c0',
                  },
                  '&:disabled': {
                    backgroundColor: '#e0e0e0',
                  },
                }}
              >
                {loading ? 'Searching...' : 'Search'}
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Results Section */}
        <Box>
          {/* Loading State */}
          {loading && (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              py={6}
            >
              <Paper
                elevation={1}
                sx={{
                  p: 4,
                  borderRadius: 2,
                  border: '1px solid #e0e0e0',
                  textAlign: 'center',
                }}
              >
                <CircularProgress size={40} sx={{ mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  Searching for hotels...
                </Typography>
              </Paper>
            </Box>
          )}

          {/* Error State */}
          {error && !loading && (
            <Paper
              elevation={1}
              sx={{
                mb: 4,
                p: 3,
                borderRadius: 2,
                border: '1px solid #e0e0e0',
              }}
            >
              <Alert 
                severity="error" 
                sx={{ 
                  borderRadius: 1,
                }}
              >
                {error}
              </Alert>
            </Paper>
          )}

          {/* Results Header */}
          {hotels.length > 0 && !loading && (
            <Box sx={{ mb: 3 }}>
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 600, 
                  color: '#1a1a1a',
                  mb: 1,
                }}
              >
                {hotels.length} Hotels Found in {searchParams.destination}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Choose from our selection of quality accommodations
              </Typography>
            </Box>
          )}

          {/* Hotels Grid */}
          {hotels.length > 0 && !loading && (
            <Grid 
              container 
              spacing={{ xs: 1, sm: 2, md: 3 }} // Tighter spacing on mobile
              sx={{
                px: { xs: 1, sm: 1, md: 3 }, // Reduced padding on mobile
                py: { xs: 1, sm: 2, md: 3 }, // Reduced vertical padding on mobile
                mb: { xs: 2, md: 4 }, // Reduced bottom margin on mobile
              }}
            >
              {hotels.map((hotel) => (
                <Grid 
                  item 
                  xs={12} 
                  lg={6} 
                  key={hotel.id}
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    p: 0, // Remove padding here since cards have their own margin
                  }}
                >
                  <HotelCard
                    hotel={hotel}
                    onBook={handleBookHotel}
                    onViewDetails={handleViewDetails}
                  />
                </Grid>
              ))}
            </Grid>
          )}

          {/* Empty State */}
          {!loading && !error && hotels.length === 0 && (
            <Paper
              elevation={1}
              sx={{
                py: 6,
                px: 4,
                borderRadius: 2,
                border: '1px solid #e0e0e0',
                textAlign: 'center',
              }}
            >
              <Typography variant="h6" sx={{ mb: 2, color: '#666' }}>
                Ready to search for hotels?
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Enter a destination and dates to find available hotels
              </Typography>
            </Paper>
          )}
        </Box>

        {/* Booking Modal */}
        {selectedHotel && (
          <BookingModal
            hotel={selectedHotel}
            open={bookingModalOpen}
            onClose={() => setBookingModalOpen(false)}
            onConfirm={handleBookingConfirm}
            checkIn={searchParams.checkIn}
            checkOut={searchParams.checkOut}
            guests={searchParams.guests}
          />
        )}

        {/* Hotel Details Modal */}
        {selectedHotel && detailsModalOpen && (
          <HotelDetailsModal
            hotel={selectedHotel}
            open={detailsModalOpen}
            onClose={() => setDetailsModalOpen(false)}
            checkIn={searchParams.checkIn}
            checkOut={searchParams.checkOut}
            guests={searchParams.guests}
          />
        )}
      </Container>
    </Box>
  );
};

export default HotelBooking;