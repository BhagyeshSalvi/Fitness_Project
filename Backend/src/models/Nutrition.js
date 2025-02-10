const connection = require('../config/db');

const Nutrition = {
    // Create or update nutrition record
    saveOrUpdate: (userId, calories, protein, carbs, fats) => {
        return new Promise((resolve, reject) => {
            const query = `
                INSERT INTO nutrition (user_id, calories, protein, carbs, fats) 
                VALUES (?, ?, ?, ?, ?) 
                ON DUPLICATE KEY UPDATE 
                calories = VALUES(calories), 
                protein = VALUES(protein), 
                carbs = VALUES(carbs), 
                fats = VALUES(fats), 
                updated_at = CURRENT_TIMESTAMP
            `;
            connection.query(query, [userId, calories, protein, carbs, fats], (err, result) => {
                if (err) {
                    console.error('❌ Database Error (saveOrUpdate):', err);
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    },

    // Fetch user nutrition data
    findByUserId: (userId) => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM nutrition WHERE user_id = ?';
            connection.query(query, [userId], (err, results) => {
                if (err) {
                    console.error('❌ Database Error (findByUserId):', err);
                    reject(err);
                } else {
                    resolve(results.length > 0 ? results[0] : null);
                }
            });
        });
    }
};

module.exports = Nutrition;
