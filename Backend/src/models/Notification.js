const db = require('../config/db'); // or your database connector

const Notification = {
  getPreferences: async (userId) => {
    const [rows] = await db.query(
      "SELECT * FROM notification_settings WHERE user_id = ?",
      [userId]
    );
    return rows[0];
  },

  saveOrUpdatePreferences: async ({
    user_id,
    meal_reminder,
    meal_reminder_time,
    workout_reminder,
    workout_reminder_time
  }) => {
    const [result] = await db.query(
      `INSERT INTO notification_settings (
        user_id,
        meal_reminder,
        meal_reminder_time,
        workout_reminder,
        workout_reminder_time
      ) VALUES (?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        meal_reminder = VALUES(meal_reminder),
        meal_reminder_time = VALUES(meal_reminder_time),
        workout_reminder = VALUES(workout_reminder),
        workout_reminder_time = VALUES(workout_reminder_time)`,
      [
        user_id,
        meal_reminder,
        meal_reminder_time,
        workout_reminder,
        workout_reminder_time,
      ]
    );
    return result;
  },
};

module.exports = Notification;
