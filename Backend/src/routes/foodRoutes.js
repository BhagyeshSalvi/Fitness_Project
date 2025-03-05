const express = require('express');
const router = express.Router();
const foodController = require('../controllers/foodController');

//Search for food
router.get("/search/:query", foodController.searchFood);

//Log food entry
router.post("/log", foodController.logFood);

// Fetch logged food for a specific date
router.get("/:userId/:date", foodController.getLoggedFood);

//Fetch daily macro summary
router.get("/summary/:userId/:date", foodController.getDailySummary);




module.exports = router;
