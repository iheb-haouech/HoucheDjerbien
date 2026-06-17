const express = require('express');
const {
  getAllListings,
  getListingById,
  createListing,
} = require('../controllers/listing.controller');
const protect = require('../middleware/auth.middleware');
const { requireAdminOrHost } = require('../middleware/role.middleware');

const router = express.Router();

router.get('/', getAllListings);
router.get('/:id', getListingById);
router.post('/', protect, requireAdminOrHost, createListing);

module.exports = router;