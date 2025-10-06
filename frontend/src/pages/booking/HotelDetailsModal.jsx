import React, { useEffect, useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, CircularProgress, Divider
} from '@mui/material';
import { bookingService } from '../../services/bookingService';

const HotelDetailsModal = ({ hotel, open, onClose, checkIn, checkOut, guests }) => {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (open && hotel) {
      fetchDetails();
    }
    // eslint-disable-next-line
  }, [open, hotel]);

  const fetchDetails = async () => {
    setLoading(true);
    setError(null);
    setDetails(null);
    try {
      const result = await bookingService.getHotelDetails({
        hotel_id: hotel.id || hotel.hotel_id,
        checkin: checkIn,
        checkout: checkOut,
        guests: guests || 2,
      });
      if (result.success) {
        setDetails(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to fetch hotel details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Hotel Details</DialogTitle>
      <DialogContent>
        {loading && <Box display="flex" justifyContent="center" py={4}><CircularProgress /></Box>}
        {error && <Typography color="error">{error}</Typography>}
        {details && (
          <Box>
            <Typography variant="h5" gutterBottom>{details.hotel_name || details.name}</Typography>
            <Typography variant="subtitle1" gutterBottom>{details.address}</Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="body1">{details.description || details.hotel_description}</Typography>
            {/* Add more details as needed */}
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default HotelDetailsModal;
