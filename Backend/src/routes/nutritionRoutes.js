const express = require('express');
const router = express.Router();
const nutritionController = require('../controllers/nutritionController');

// Save or update nutrition data
router.post('/save', nutritionController.saveNutrition);

// Get nutrition data for a specific user
router.get('/:userId', nutritionController.getNutrition);

//Send Physical info and get nutrition info
router.post('/calculate',nutritionController.calculateNutrition)

module.exports = router;
