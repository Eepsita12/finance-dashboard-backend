const express = require('express');
const router = express.Router();
const { createUser, listUsers } = require('../controllers/userController');

// User management is open — no role restriction needed
router.post('/', createUser);
router.get('/', listUsers);

module.exports = router;
