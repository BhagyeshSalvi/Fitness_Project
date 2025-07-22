const db = require('../config/db'); 

exports.getPreferences = (req, res) => {
  const userId = req.params.userId;
  db.query(
    'SELECT * FROM notification_settings WHERE user_id = ? LIMIT 1',
    [userId],
    (err, results) => {
      if (err) {
        console.error("❌ Error fetching preferences:", err);
        return res.status(500).json({ error: "Failed to fetch preferences" });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: "No preferences found" });
      }

      res.status(200).json(results[0]);
    }
  );
};

exports.savePreferences = (req, res) => {
  const { user_id, meal_reminder, meal_reminder_time, workout_reminder, workout_reminder_time } = req.body;

  const query = `
    INSERT INTO notification_settings (user_id, meal_reminder, meal_reminder_time, workout_reminder, workout_reminder_time)
    VALUES (?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      meal_reminder = VALUES(meal_reminder),
      meal_reminder_time = VALUES(meal_reminder_time),
      workout_reminder = VALUES(workout_reminder),
      workout_reminder_time = VALUES(workout_reminder_time)
  `;

  const values = [user_id, meal_reminder, meal_reminder_time, workout_reminder, workout_reminder_time];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("❌ Error saving preferences:", err);
      return res.status(500).json({ error: "Failed to save preferences" });
    }

    res.status(200).json({ message: "Preferences saved successfully" });
  });
};

exports.updateNotificationSettings = (req, res) => {
  // same logic reused
  exports.savePreferences(req, res);
};
