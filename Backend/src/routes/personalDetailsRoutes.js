const express = require('express');
const router = express.Router();
const personalDetailsController = require('../controllers/personalDetailsController');

// POST ➔ Save or Update personal details
router.post('/save', personalDetailsController.savePersonalDetails);

// GET ➔ Fetch personal details
router.get('/get', personalDetailsController.getPersonalDetails);

module.exports = router;
