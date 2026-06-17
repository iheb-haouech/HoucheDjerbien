const express = require('express');
const {
  createPromoCode,
  createSeason,
  updateSeason,
  createManualBooking,
  getAllBookings,
  updateBookingStatus,
  deleteBooking,
} = require('../controllers/admin.controller');

const protect = require('../middleware/auth.middleware');
const { requireAdmin } = require('../middleware/role.middleware');

const router = express.Router();

router.post('/promo', protect, requireAdmin, createPromoCode);
router.post('/season', protect, requireAdmin, createSeason);
router.put('/season/:id', protect, requireAdmin, updateSeason);
router.get('/bookings', protect, requireAdmin, getAllBookings);
router.post('/manual-booking', protect, requireAdmin, createManualBooking);
router.patch('/bookings/:id/status', protect, requireAdmin, updateBookingStatus);
router.delete('/bookings/:id', protect, requireAdmin, deleteBooking);

module.exports = router;
