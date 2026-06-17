const express = require('express');
const {
  createCleaningRequest,
  getMyCleaningRequests,
  getAllCleaningRequests,
} = require('../controllers/cleaning.controller');
const protect = require('../middleware/auth.middleware');
const { requireAdminOrHost } = require('../middleware/role.middleware');

const router = express.Router();

router.post('/', protect, createCleaningRequest);
router.get('/my', protect, getMyCleaningRequests);
router.get('/', protect, requireAdminOrHost, getAllCleaningRequests);

module.exports = router;