const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

router.get('/:userId', notificationController.getPreferences);
router.post('/', notificationController.savePreferences);

module.exports = router;
