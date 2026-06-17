const express = require('express');
const {
  createConstructionRequest,
  getMyConstructionRequests,
  getAllConstructionRequests,
} = require('../controllers/construction.controller');
const protect = require('../middleware/auth.middleware');
const { requireAdminOrHost } = require('../middleware/role.middleware');

const router = express.Router();

router.post('/', protect, createConstructionRequest);
router.get('/my', protect, getMyConstructionRequests);
router.get('/', protect, requireAdminOrHost, getAllConstructionRequests);

module.exports = router;
