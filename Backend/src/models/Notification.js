const db = require('../config/db');

const Notification = {
  getPreferences: (userId) => {
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT * FROM notification_settings WHERE user_id = ?`,
        [userId],
        (err, result) => err ? reject(err) : resolve(result[0])
      );
    });
  },

  savePreferences: (userId, prefs) => {
    const {
      meal_reminder,
      meal_reminder_time,
      workout_reminder,
      workout_reminder_time
    } = prefs;

    return new Promise((resolve, reject) => {
      db.query(
        `INSERT INTO notification_settings 
          (user_id, meal_reminder, meal_reminder_time, workout_reminder, workout_reminder_time)
         VALUES (?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE 
           meal_reminder = VALUES(meal_reminder),
           meal_reminder_time = VALUES(meal_reminder_time),
           workout_reminder = VALUES(workout_reminder),
           workout_reminder_time = VALUES(workout_reminder_time)`,
        [userId, meal_reminder, meal_reminder_time, workout_reminder, workout_reminder_time],
        (err, result) => err ? reject(err) : resolve(result)
      );
    });
  }
};

module.exports = Notification;
