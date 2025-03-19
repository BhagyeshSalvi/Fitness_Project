const db = require('../config/db');

const PersonalDetails = {
    saveOrUpdate: (user_id, gender, weight, height, age, activity_level, goal) => {
        const sql = `
            INSERT INTO personal_details (user_id, gender, weight, height, age, activity_level, goal)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
                gender = VALUES(gender),
                weight = VALUES(weight),
                height = VALUES(height),
                age = VALUES(age),
                activity_level = VALUES(activity_level),
                goal = VALUES(goal)
        `;
        return new Promise((resolve, reject) => {
            db.query(sql, [user_id, gender, weight, height, age, activity_level, goal], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    },

    getUserPersonalDetails: (user_id) => {
        const sql = `SELECT * FROM personal_details WHERE user_id = ?`;
        return new Promise((resolve, reject) => {
            db.query(sql, [user_id], (err, result) => {
                if (err) reject(err);
                else resolve(result[0]);
            });
        });
    }
};

module.exports = PersonalDetails;
