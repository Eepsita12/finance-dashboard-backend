const express = require('express');
const router = express.Router();
const { createRecord, listRecords, deleteRecord } = require('../controllers/recordController');
const { requireRole } = require('../middleware/roleCheck');

router.post('/', requireRole('admin'), createRecord);
router.get('/', requireRole('analyst', 'admin'), listRecords);
router.delete('/:id', requireRole('admin'), deleteRecord);

module.exports = router;
