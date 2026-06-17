const express = require('express');
const {
  createBooking,
  getMyBookings,
  getBookingsByListing,
} = require('../controllers/booking.controller');
const protect = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/my', protect, getMyBookings);
router.get('/listing/:listingId', getBookingsByListing);
router.post('/', protect, createBooking);

module.exports = router;