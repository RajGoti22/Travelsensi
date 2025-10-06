const express = require('express');
const axios = require('axios');
const router = express.Router();

// Replace with your actual RapidAPI key
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
const RAPIDAPI_HOST = 'booking-com15.p.rapidapi.com';

// Get hotel details endpoint
router.get('/get-hotel-details', async (req, res) => {
  try {
    const {
      hotel_id,
      arrival_date,
      departure_date,
      adults = '1',
      children_age = '',
      room_qty = '1',
      units = 'metric',
      temperature_unit = 'c',
      languagecode = 'en-us',
      currency_code = 'EUR',
    } = req.query;

    const response = await axios.get('https://booking-com15.p.rapidapi.com/api/v1/hotels/getHotelDetails', {
      params: {
        hotel_id,
        arrival_date,
        departure_date,
        adults,
        children_age,
        room_qty,
        units,
        temperature_unit,
        languagecode,
        currency_code,
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
