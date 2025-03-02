const express = require('express');
const router = express.Router();
const workoutController = require('../controllers/workoutController');

// ✅ Save or update workout data
router.post('/save', workoutController.saveWorkout);

// ✅ Get workout data for a specific user
router.get('/:userId', workoutController.getWorkout);

// ✅ Generate workout recommendation
router.get('/recommend/:userId', workoutController.generateWorkoutPlan);

// ✅ Save final workout plan
router.post('/save-plan', workoutController.saveFinalWorkoutPlan);

module.exports = router;
