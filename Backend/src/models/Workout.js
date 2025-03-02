const connection = require('../config/db');

const Workout = {
    // Save or update workout data
    saveOrUpdate: (userId, daysSelected, workoutDays) => {
        return new Promise((resolve, reject) => {
            const query = `
                INSERT INTO workouts (user_id, days_selected, workout_days) 
                VALUES (?, ?, ?) 
                ON DUPLICATE KEY UPDATE 
                days_selected = VALUES(days_selected), 
                workout_days = VALUES(workout_days), 
                updated_at = CURRENT_TIMESTAMP
            `;
            connection.query(query, [userId, daysSelected, JSON.stringify(workoutDays)], (err, result) => {
                if (err) {
                    console.error('❌ Database Error (saveOrUpdate):', err);
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    },

    // Fetch user workout data
    findByUserId: (userId) => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM workouts WHERE user_id = ?';
            connection.query(query, [userId], (err, results) => {
                if (err) {
                    console.error('❌ Database Error (findByUserId):', err);
                    reject(err);
                } else {
                    resolve(results.length > 0 ? results[0] : null);
                }
            });
        });
    },

    // Save Finalized Workout Plan
    saveFinalWorkoutPlan: (userId, workoutPlan) => {
        return new Promise((resolve, reject) => {
            const query = `
                UPDATE workouts 
                SET workout_plan = ?, updated_at = CURRENT_TIMESTAMP
                WHERE user_id = ?
            `;
            connection.query(query, [JSON.stringify(workoutPlan), userId], (err, result) => {
                if (err) {
                    console.error('❌ Database Error (saveFinalWorkoutPlan):', err);
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }
};

module.exports = Workout;
