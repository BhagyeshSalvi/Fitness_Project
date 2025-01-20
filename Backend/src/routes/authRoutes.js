const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.register); // Signup
router.post('/login', authController.login);       // Login

module.exports = router;
