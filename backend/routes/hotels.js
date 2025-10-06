const express = require('express');
const axios = require('axios');
const router = express.Router();

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
const RAPIDAPI_HOST = 'booking-com15.p.rapidapi.com';

// Search hotels by city/country
router.get('/search', async (req, res) => {
  try {
    const { location, checkin, checkout, guests = 2 } = req.query;
    // 1. Get destination ID from Booking.com
    const destRes = await axios.get('https://booking-com15.p.rapidapi.com/api/v1/hotels/searchDestination', {
      params: { query: location },
      headers: {
        'x-rapidapi-key': RAPIDAPI_KEY,
        'x-rapidapi-host': RAPIDAPI_HOST,
      },
    });
    const destId = destRes.data?.data?.[0]?.dest_id;
    if (!destId) return res.status(404).json({ error: 'Destination not found' });

    // 2. Search hotels for that destination
    const hotelsRes = await axios.get('https://booking-com15.p.rapidapi.com/api/v1/hotels/searchHotels', {
      params: {
        dest_id: destId,
        checkin_date: checkin,
        checkout_date: checkout,
        adults_number: guests,
      },
      headers: {
        'x-rapidapi-key': RAPIDAPI_KEY,
        'x-rapidapi-host': RAPIDAPI_HOST,
      },
    });

    // 3. Map and return hotel data
    res.json(hotelsRes.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get hotel details
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { checkin, checkout, guests = 2 } = req.query;
    const response = await axios.get('https://booking-com15.p.rapidapi.com/api/v1/hotels/getHotelDetails', {
      params: {
        hotel_id: id,
        arrival_date: checkin,
        departure_date: checkout,
        adults: guests,
      },
      headers: {
        'x-rapidapi-key': RAPIDAPI_KEY,
        'x-rapidapi-host': RAPIDAPI_HOST,
      },
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
