const express = require('express');
const router = express.Router();
const controller = require('../controllers/notificationController'); // ✅ correct path

router.get('/:userId', controller.getPreferences);
router.post('/', controller.savePreferences);
router.put('/', controller.updateNotificationSettings);

module.exports = router;
