const db = require('../config/db');

const Activity = {
    logActivity: (user_id, activity_name, duration_minutes, intensity, calories_burned, date) => {
        const sql = `
            INSERT INTO activity_logs (user_id, activity_name, duration_minutes, intensity, calories_burned, date)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        return new Promise((resolve, reject) => {
            db.query(sql, [user_id, activity_name, duration_minutes, intensity, calories_burned, date], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    },

    
    getActivityHistory: (user_id, date) => {
        const sql = `
            SELECT * FROM activity_logs 
            WHERE user_id = ? AND date = ?
        `;
        return new Promise((resolve, reject) => {
            db.query(sql, [user_id, date], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    }
};

module.exports = Activity;
