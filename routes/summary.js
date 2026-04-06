const express = require('express');
const router = express.Router();
const { getSummary } = require('../controllers/summaryController');
const { requireRole } = require('../middleware/roleCheck');

router.get('/', requireRole('viewer', 'analyst', 'admin'), getSummary);

module.exports = router;
