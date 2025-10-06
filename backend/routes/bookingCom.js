const express = require('express');
const axios = require('axios');
const router = express.Router();

// Replace with your actual RapidAPI key
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
const RAPIDAPI_HOST = 'booking-com18.p.rapidapi.com';

// Example: Search hotels endpoint
router.get('/hotels', async (req, res) => {
  try {
    const { city, checkin_date, checkout_date, adults_number } = req.query;
    const response = await axios.get('https://booking-com18.p.rapidapi.com/hotels/search-by-city', {
      params: {
        city,
        checkin_date,
        checkout_date,
        adults_number,
        // Add more params as needed
      },
      headers: {
        'X-RapidAPI-Key': RAPIDAPI_KEY,
        'X-RapidAPI-Host': RAPIDAPI_HOST,
      },
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Example: Search flights endpoint (if available in API)
// router.get('/flights', async (req, res) => { ... });

module.exports = router;
