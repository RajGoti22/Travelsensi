import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Chip,
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
  Switch,
  FormControlLabel,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import {
  Flight,
  FlightTakeoff,
  FlightLand,
  Person,
  SwapHoriz,
  Close,
  Schedule,
  Luggage,
  EventSeat,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { bookingService } from '../../services/bookingService';

const FlightCard = ({ flight, onBook, onViewDetails }) => (
  <Paper
    elevation={2}
    sx={{
      mb: 2,
      borderRadius: 3,
      overflow: 'hidden',
      p: { xs: 2, sm: 3 },
      display: 'flex',
      flexDirection: { xs: 'column', md: 'row' },
      alignItems: { xs: 'stretch', md: 'center' },
      gap: { xs: 2, md: 0 },
      boxShadow: { xs: 1, sm: 2, md: 3 },
      transition: 'box-shadow 0.2s',
      '&:hover': { boxShadow: 6 },
    }}
  >
    {/* Airline Info */}
    <Box sx={{ minWidth: 90, textAlign: 'center', mb: { xs: 1, md: 0 } }}>
      <Typography variant="h4" sx={{ mb: 0.5 }}>{flight.logo}</Typography>
      <Typography variant="body2" sx={{ fontWeight: 700 }}>{flight.airlineCode}</Typography>
      <Typography variant="caption" color="text.secondary">{flight.airline}</Typography>
    </Box>

    {/* Flight Route */}
    <Box sx={{ flex: 1, px: { xs: 0, md: 2 }, mb: { xs: 1, md: 0 } }}>
      <Grid container alignItems="center" spacing={1}>
        <Grid item xs={5} md={4} sx={{ textAlign: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>{flight.departTime}</Typography>
          <Typography variant="body2" color="text.secondary">{flight.origin}</Typography>
        </Grid>
        <Grid item xs={2} md={4} sx={{ textAlign: 'center' }}>
          <Flight sx={{ color: 'primary.main', fontSize: 28, transform: 'rotate(90deg)' }} />
          <Typography variant="caption" color="text.secondary" display="block">{flight.duration}</Typography>
          <Typography variant="caption" color="text.secondary">{flight.stops}</Typography>
        </Grid>
        <Grid item xs={5} md={4} sx={{ textAlign: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>{flight.arriveTime}</Typography>
          <Typography variant="body2" color="text.secondary">{flight.destination}</Typography>
        </Grid>
      </Grid>
      {flight.returnDate && (
        <Divider sx={{ my: 1 }} />
      )}
      {flight.returnDate && (
        <Grid container alignItems="center" spacing={1}>
          <Grid item xs={5} md={4} sx={{ textAlign: 'center' }}>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>{flight.returnDepartTime}</Typography>
            <Typography variant="caption" color="text.secondary">{flight.destination}</Typography>
          </Grid>
          <Grid item xs={2} md={4} sx={{ textAlign: 'center' }}>
            <Flight sx={{ color: 'secondary.main', fontSize: 20, transform: 'rotate(270deg)' }} />
          </Grid>
          <Grid item xs={5} md={4} sx={{ textAlign: 'center' }}>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>{flight.returnArriveTime}</Typography>
            <Typography variant="caption" color="text.secondary">{flight.origin}</Typography>
          </Grid>
        </Grid>
      )}
    </Box>

    {/* Flight Details */}
    <Box sx={{ minWidth: 90, textAlign: 'center', mb: { xs: 1, md: 0 } }}>
      <Chip label={flight.seatClass} size="small" color="primary" sx={{ mb: 1 }} />
      <Typography variant="caption" color="text.secondary" display="block">{flight.aircraft}</Typography>
      <Typography variant="caption" color="text.secondary" display="block">
        <Luggage sx={{ fontSize: 12, mr: 0.5 }} />{flight.baggage}
      </Typography>
    </Box>

    {/* Price and Booking */}
    <Box sx={{ minWidth: 120, textAlign: 'center' }}>
      <Typography variant="h5" color="primary" sx={{ fontWeight: 700 }}>${flight.price}</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ textDecoration: 'line-through' }}>${flight.originalPrice}</Typography>
      <Typography variant="caption" display="block" sx={{ mb: 1 }}>per person</Typography>
      <Button
        variant="contained"
        size="small"
        fullWidth
        onClick={() => onBook(flight)}
        sx={{ mb: 1, fontWeight: 600 }}
      >
        Book Now
      </Button>
      <Button
        variant="outlined"
        size="small"
        fullWidth
        onClick={() => onViewDetails(flight)}
      >
        Details
      </Button>
    </Box>
  </Paper>
);

const FlightBooking = () => {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tripType, setTripType] = useState('roundtrip');
  const [searchParams, setSearchParams] = useState({
    origin: 'New York, NY',
    destination: 'Tokyo, Japan',
    departDate: '2025-10-15',
    returnDate: '2025-10-22',
    passengers: 1,
    seatClass: 'economy',
  });
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    searchFlights();
  }, []);

  const searchFlights = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await bookingService.searchFlights(
        searchParams.origin,
        searchParams.destination,
        searchParams.departDate,
        tripType === 'roundtrip' ? searchParams.returnDate : null,
        searchParams.passengers
      );

      if (result.success) {
        setFlights(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to search flights. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBookFlight = (flight) => {
    setSelectedFlight(flight);
    setBookingModalOpen(true);
  };

  const handleViewDetails = (flight) => {
    setSelectedFlight(flight);
    // Open details modal (you can implement this similarly to hotel booking)
  };

  const handleSwapDestinations = () => {
    setSearchParams({
      ...searchParams,
      origin: searchParams.destination,
      destination: searchParams.origin,
    });
  };

  const handleTripTypeChange = (event, newTripType) => {
    if (newTripType !== null) {
      setTripType(newTripType);
      if (newTripType === 'oneway') {
        setSearchParams({ ...searchParams, returnDate: '' });
      }
    }
  };

  return (
      <Box sx={{ bgcolor: '#f8fafc', minHeight: '100vh', py: { xs: 2, md: 4 } }}>
        <Container maxWidth="md">
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h3" sx={{ fontWeight: 700, color: '#1a237e', mb: 1, fontSize: { xs: '2rem', md: '2.5rem' } }}>
              <Flight sx={{ mr: 1, fontSize: '2.2rem', verticalAlign: 'middle' }} /> Flight Booking
            </Typography>
            <Typography variant="h6" sx={{ color: '#374151', fontWeight: 400, fontSize: { xs: '1rem', md: '1.1rem' } }}>
              Find and book your next flight with ease
            </Typography>
          </Box>

          {/* Search Form */}
          <Paper elevation={2} sx={{ p: { xs: 2, sm: 3 }, mb: 4, borderRadius: 3 }}>
            <Box sx={{ mb: 2, textAlign: 'center' }}>
              <ToggleButtonGroup
                value={tripType}
                exclusive
                onChange={handleTripTypeChange}
                size="small"
                sx={{ mx: 'auto' }}
              >
                <ToggleButton value="roundtrip">Round Trip</ToggleButton>
                <ToggleButton value="oneway">One Way</ToggleButton>
                <ToggleButton value="multicity">Multi-City</ToggleButton>
              </ToggleButtonGroup>
            </Box>
            <Grid container spacing={2} alignItems="center">
              {/* From */}
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="From"
                  value={searchParams.origin}
                  onChange={(e) => setSearchParams({ ...searchParams, origin: e.target.value })}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FlightTakeoff />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              {/* Swap Button */}
              <Grid item xs={12} sm={12} md="auto" sx={{ textAlign: 'center' }}>
                <IconButton
                  onClick={handleSwapDestinations}
                  sx={{ border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', '&:hover': { bgcolor: 'action.hover' }, my: { xs: 1, md: 0 } }}
                >
                  <SwapHoriz />
                </IconButton>
              </Grid>
              {/* To */}
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="To"
                  value={searchParams.destination}
                  onChange={(e) => setSearchParams({ ...searchParams, destination: e.target.value })}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FlightLand />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              {/* Departure Date */}
              <Grid item xs={12} sm={6} md={2}>
                <TextField
                  fullWidth
                  label="Departure"
                  type="date"
                  value={searchParams.departDate}
                  onChange={(e) => setSearchParams({ ...searchParams, departDate: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              {/* Return Date */}
              {tripType === 'roundtrip' && (
                <Grid item xs={12} sm={6} md={2}>
                  <TextField
                    fullWidth
                    label="Return"
                    type="date"
                    value={searchParams.returnDate}
                    onChange={(e) => setSearchParams({ ...searchParams, returnDate: e.target.value })}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              )}
              {/* Passengers */}
              <Grid item xs={12} sm={6} md={2}>
                <TextField
                  fullWidth
                  label="Passengers"
                  type="number"
                  value={searchParams.passengers}
                  onChange={(e) => setSearchParams({ ...searchParams, passengers: parseInt(e.target.value) })}
                  inputProps={{ min: 1, max: 9 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              {/* Class */}
              <Grid item xs={12} sm={6} md={2}>
                <FormControl fullWidth>
                  <InputLabel>Class</InputLabel>
                  <Select
                    value={searchParams.seatClass}
                    label="Class"
                    onChange={(e) => setSearchParams({ ...searchParams, seatClass: e.target.value })}
                  >
                    <MenuItem value="economy">Economy</MenuItem>
                    <MenuItem value="premium">Premium Economy</MenuItem>
                    <MenuItem value="business">Business</MenuItem>
                    <MenuItem value="first">First Class</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              {/* Search Button */}
              <Grid item xs={12} md={2}>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={searchFlights}
                  disabled={loading}
                  sx={{ height: 56, fontWeight: 600 }}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Search Flights'}
                </Button>
              </Grid>
            </Grid>
          </Paper>

          {/* Error */}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {/* Results */}
          {flights.length > 0 && (
            <>
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, mb: 2, gap: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>{flights.length} flights found</Typography>
                <Box>
                  <Chip label="Best Value" size="small" color="success" sx={{ mr: 1, mb: { xs: 1, sm: 0 } }} />
                  <Chip label="Fastest" size="small" color="info" sx={{ mr: 1, mb: { xs: 1, sm: 0 } }} />
                  <Chip label="Cheapest" size="small" color="warning" />
                </Box>
              </Box>
              {flights.map((flight) => (
                <FlightCard
                  key={flight.id}
                  flight={flight}
                  onBook={handleBookFlight}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </>
          )}

          {/* Loading */}
          {loading && (
            <Box display="flex" justifyContent="center" py={4}>
              <CircularProgress />
            </Box>
          )}

          {/* Flight Booking Modal */}
          <Dialog 
            open={bookingModalOpen} 
            onClose={() => setBookingModalOpen(false)}
            maxWidth="sm" 
            fullWidth
          >
            <DialogTitle>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">Book Flight</Typography>
                <IconButton onClick={() => setBookingModalOpen(false)}>
                  <Close />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent>
              {selectedFlight && (
                <Paper sx={{ p: 2, bgcolor: 'grey.50', mb: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography variant="h6">
                        {selectedFlight.airline} - {selectedFlight.airlineCode}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {selectedFlight.origin} → {selectedFlight.destination}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2">Departure</Typography>
                      <Typography variant="body2">
                        {selectedFlight.departDate} at {selectedFlight.departTime}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2">Arrival</Typography>
                      <Typography variant="body2">
                        {selectedFlight.departDate} at {selectedFlight.arriveTime}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2">Passengers</Typography>
                      <Typography variant="body2">{selectedFlight.passengers}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2">Total Price</Typography>
                      <Typography variant="h6" color="primary">
                        ${selectedFlight.totalPrice}
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>
              )}
              <Typography variant="body2" sx={{ mt: 2, textAlign: 'center', color: 'text.secondary' }}>
                Complete booking flow would be implemented here similar to hotel booking.
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setBookingModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="contained">
                Proceed to Book
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      </Box>
    );
};

export default FlightBooking;