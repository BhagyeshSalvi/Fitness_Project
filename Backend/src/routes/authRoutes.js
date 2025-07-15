const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.register); // Signup
router.post('/login', authController.login);       // Login
router.get('/info/:userId', authController.getUserInfoById);
router.put('/change-password', authController.changePassword);


module.exports = router;
