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
  Avatar,
  Divider,
  Tab,
  Tabs,
  Paper,
  IconButton,
  Menu,
  MenuItem,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemAvatar,
} from '@mui/material';
import {
  Hotel,
  Flight,
  Tour,
  MoreVert,
  Cancel,
  Edit,
  Download,
  Share,
  CheckCircle,
  Schedule,
  LocationOn,
  Person,
  CalendarToday,
  AttachMoney,
  Phone,
  Email,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

const BookingCard = ({ booking, onCancel, onEdit, onDownload, onShare }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'hotel': return <Hotel color="primary" />;
      case 'flight': return <Flight color="success" />;
      case 'activity': return <Tour color="warning" />;
      default: return <Hotel />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'success';
      case 'pending': return 'warning';
      case 'cancelled': return 'error';
      case 'completed': return 'info';
      default: return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'confirmed': return 'Confirmed';
      case 'pending': return 'Pending';
      case 'cancelled': return 'Cancelled';
      case 'completed': return 'Completed';
      default: return status;
    }
  };

  return (
    <Card sx={{ mb: 2, transition: 'all 0.3s ease', '&:hover': { boxShadow: 4 } }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ bgcolor: 'grey.100', mr: 2 }}>
              {getTypeIcon(booking.type)}
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                {booking.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Booking ID: {booking.id}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Chip
              label={getStatusText(booking.status)}
              color={getStatusColor(booking.status)}
              size="small"
              sx={{ mr: 1 }}
            />
            <IconButton onClick={handleMenuClick}>
              <MoreVert />
            </IconButton>
          </Box>
        </Box>

        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={6} sm={3}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <CalendarToday sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary">
                Date
              </Typography>
            </Box>
            <Typography variant="body2">
              {booking.date || booking.checkIn}
            </Typography>
          </Grid>
          
          <Grid item xs={6} sm={3}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <LocationOn sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary">
                Location
              </Typography>
            </Box>
            <Typography variant="body2">
              {booking.location || booking.destination}
            </Typography>
          </Grid>
          
          <Grid item xs={6} sm={3}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Person sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary">
                Guests
              </Typography>
            </Box>
            <Typography variant="body2">
              {booking.guests || booking.passengers || booking.participants} {booking.type === 'hotel' ? 'guests' : booking.type === 'flight' ? 'passengers' : 'participants'}
            </Typography>
          </Grid>
          
          <Grid item xs={6} sm={3}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <AttachMoney sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary">
                Total
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'success.main' }}>
              ${booking.totalPrice}
            </Typography>
          </Grid>
        </Grid>

        {booking.type === 'hotel' && (
          <Typography variant="body2" color="text.secondary">
            {booking.checkIn} - {booking.checkOut} • {booking.roomType} • {booking.nights} nights
          </Typography>
        )}

        {booking.type === 'flight' && (
          <Typography variant="body2" color="text.secondary">
            {booking.departure} → {booking.arrival} • {booking.airline} • {booking.flightNumber}
          </Typography>
        )}

        {booking.type === 'activity' && (
          <Typography variant="body2" color="text.secondary">
            {booking.duration} • {booking.category} • Meeting point: {booking.meetingPoint}
          </Typography>
        )}
      </CardContent>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => { onEdit(booking); handleMenuClose(); }}>
          <ListItemIcon><Edit fontSize="small" /></ListItemIcon>
          Edit Booking
        </MenuItem>
        <MenuItem onClick={() => { onDownload(booking); handleMenuClose(); }}>
          <ListItemIcon><Download fontSize="small" /></ListItemIcon>
          Download Voucher
        </MenuItem>
        <MenuItem onClick={() => { onShare(booking); handleMenuClose(); }}>
          <ListItemIcon><Share fontSize="small" /></ListItemIcon>
          Share Details
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => { onCancel(booking); handleMenuClose(); }} sx={{ color: 'error.main' }}>
          <ListItemIcon><Cancel fontSize="small" color="error" /></ListItemIcon>
          Cancel Booking
        </MenuItem>
      </Menu>
    </Card>
  );
};

const BookingDetails = ({ booking, open, onClose }) => (
  <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
    <DialogTitle>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
          {booking?.type === 'hotel' ? <Hotel /> : booking?.type === 'flight' ? <Flight /> : <Tour />}
        </Avatar>
        <Box>
          <Typography variant="h6">{booking?.name}</Typography>
          <Typography variant="body2" color="text.secondary">
            Booking ID: {booking?.id}
          </Typography>
        </Box>
      </Box>
    </DialogTitle>
    <DialogContent>
      {booking && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Booking Information
            </Typography>
            <List dense>
              <ListItem>
                <ListItemIcon><CalendarToday /></ListItemIcon>
                <ListItemText
                  primary="Date"
                  secondary={booking.date || `${booking.checkIn} - ${booking.checkOut}`}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon><LocationOn /></ListItemIcon>
                <ListItemText
                  primary="Location"
                  secondary={booking.location || booking.destination}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon><Person /></ListItemIcon>
                <ListItemText
                  primary="Guests"
                  secondary={`${booking.guests || booking.passengers || booking.participants} ${booking.type === 'hotel' ? 'guests' : booking.type === 'flight' ? 'passengers' : 'participants'}`}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon><AttachMoney /></ListItemIcon>
                <ListItemText
                  primary="Total Price"
                  secondary={`$${booking.totalPrice}`}
                />
              </ListItem>
            </List>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Contact Information
            </Typography>
            <List dense>
              <ListItem>
                <ListItemIcon><Phone /></ListItemIcon>
                <ListItemText
                  primary="Phone"
                  secondary={booking.contactPhone || '+1 (555) 123-4567'}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon><Email /></ListItemIcon>
                <ListItemText
                  primary="Email"
                  secondary={booking.contactEmail || 'support@travelsensei.com'}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon><CheckCircle /></ListItemIcon>
                <ListItemText
                  primary="Status"
                  secondary={booking.status}
                />
              </ListItem>
            </List>
          </Grid>
        </Grid>
      )}
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Close</Button>
      <Button variant="contained">Contact Support</Button>
    </DialogActions>
  </Dialog>
);

const BookingManagement = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState(null);
  const { user } = useAuth();

  // Mock bookings data
  useEffect(() => {
    const mockBookings = [
      {
        id: 'HTL001',
        type: 'hotel',
        name: 'Grand Plaza Hotel Tokyo',
        location: 'Tokyo, Japan',
        checkIn: '2025-10-15',
        checkOut: '2025-10-18',
        nights: 3,
        roomType: 'Deluxe Room',
        guests: 2,
        totalPrice: 450,
        status: 'confirmed',
      },
      {
        id: 'FLT002',
        type: 'flight',
        name: 'Tokyo to New York',
        departure: 'NRT 14:30',
        arrival: 'JFK 09:45',
        airline: 'JAL',
        flightNumber: 'JL006',
        passengers: 2,
        totalPrice: 1200,
        status: 'confirmed',
      },
      {
        id: 'ACT003',
        type: 'activity',
        name: 'Tokyo Food Tour',
        location: 'Tokyo, Japan',
        date: '2025-10-16',
        duration: '3 hours',
        category: 'Food & Drink',
        meetingPoint: 'Shibuya Station',
        participants: 2,
        totalPrice: 120,
        status: 'confirmed',
      },
      {
        id: 'HTL004',
        type: 'hotel',
        name: 'Boutique Hotel NYC',
        location: 'New York, USA',
        checkIn: '2025-10-20',
        checkOut: '2025-10-22',
        nights: 2,
        roomType: 'Superior Room',
        guests: 2,
        totalPrice: 320,
        status: 'pending',
      },
    ];
    setBookings(mockBookings);
  }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const filterBookings = (type) => {
    if (type === 'all') return bookings;
    return bookings.filter(booking => booking.type === type);
  };

  const handleEdit = (booking) => {
    console.log('Edit booking:', booking);
    // Navigate to edit page or open edit dialog
  };

  const handleDownload = (booking) => {
    console.log('Download voucher for:', booking);
    // Generate and download voucher PDF
  };

  const handleShare = (booking) => {
    console.log('Share booking:', booking);
    // Open share dialog or copy to clipboard
  };

  const handleCancel = (booking) => {
    setBookingToCancel(booking);
    setCancelDialogOpen(true);
  };

  const confirmCancel = () => {
    if (bookingToCancel) {
      setBookings(prev => prev.map(booking => 
        booking.id === bookingToCancel.id 
          ? { ...booking, status: 'cancelled' }
          : booking
      ));
      setCancelDialogOpen(false);
      setBookingToCancel(null);
    }
  };

  const tabs = [
    { label: 'All Bookings', value: 'all' },
    { label: 'Hotels', value: 'hotel' },
    { label: 'Flights', value: 'flight' },
    { label: 'Activities', value: 'activity' },
  ];

  const currentBookings = filterBookings(tabs[activeTab].value);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
        My Bookings
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar sx={{ bgcolor: 'primary.main', mx: 'auto', mb: 1 }}>
                <Hotel />
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                {bookings.filter(b => b.type === 'hotel').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Hotels
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar sx={{ bgcolor: 'success.main', mx: 'auto', mb: 1 }}>
                <Flight />
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                {bookings.filter(b => b.type === 'flight').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Flights
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar sx={{ bgcolor: 'warning.main', mx: 'auto', mb: 1 }}>
                <Tour />
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                {bookings.filter(b => b.type === 'activity').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Activities
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar sx={{ bgcolor: 'info.main', mx: 'auto', mb: 1 }}>
                <AttachMoney />
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                ${bookings.reduce((sum, b) => sum + b.totalPrice, 0)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Spent
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
        >
          {tabs.map((tab, index) => (
            <Tab key={index} label={tab.label} />
          ))}
        </Tabs>
      </Paper>

      {/* Bookings List */}
      {currentBookings.length > 0 ? (
        currentBookings.map((booking) => (
          <BookingCard
            key={booking.id}
            booking={booking}
            onEdit={handleEdit}
            onDownload={handleDownload}
            onShare={handleShare}
            onCancel={handleCancel}
          />
        ))
      ) : (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            No {tabs[activeTab].label.toLowerCase()} found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Start planning your next trip!
          </Typography>
          <Button variant="contained" href="/booking">
            Browse Bookings
          </Button>
        </Paper>
      )}

      {/* Booking Details Modal */}
      <BookingDetails
        booking={selectedBooking}
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
      />

      {/* Cancel Confirmation Dialog */}
      <Dialog open={cancelDialogOpen} onClose={() => setCancelDialogOpen(false)}>
        <DialogTitle>Cancel Booking</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to cancel this booking? This action cannot be undone.
          </Typography>
          {bookingToCancel && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              Cancelling "{bookingToCancel.name}" - Cancellation fees may apply.
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelDialogOpen(false)}>
            Keep Booking
          </Button>
          <Button
            onClick={confirmCancel}
            color="error"
            variant="contained"
          >
            Cancel Booking
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default BookingManagement;