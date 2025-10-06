// Demo hotels route (mock data only). Mounted when USE_MOCK_HOTELS=true
const express = require('express');
const router = express.Router();
const hotels = require('../data/mockHotels');

// GET /api/hotels  (mock)
router.get('/', (req, res) => {
  const { city } = req.query;
  if (city) {
    const filtered = hotels.filter(h => h.city.toLowerCase() === city.toLowerCase());
    return res.json(filtered);
  }
  res.json(hotels);
});

// GET /api/hotels/:id (mock)
router.get('/:id', (req, res) => {
  const id = Number(req.params.id);
  const hotel = hotels.find(h => h.id === id);
  if (!hotel) return res.status(404).json({ message: 'Hotel not found' });
  res.json(hotel);
});

module.exports = router;
