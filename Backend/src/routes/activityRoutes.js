const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activityController');

// Route to log activity (with calorie calculation)
router.post('/log', activityController.logActivity);

// Route to get activity history for a specific user
router.get('/history', activityController.getActivityHistory);

module.exports = router;