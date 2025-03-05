const connection = require("../config/db");

const Food = {
    // ✅ Log a new food entry
    logFoodEntry: (userId, date, mealType, foodName, brandName, servingSize, unit, calories, protein, carbs, fats) => {
        return new Promise((resolve, reject) => {
            const query = `
                INSERT INTO food_entries (user_id, date, meal_type, food_name, brand_name, serving_size, unit, calories, protein, carbs, fats)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;
            connection.query(query, [userId, date, mealType, foodName, brandName, servingSize, unit, calories, protein, carbs, fats], (err, result) => {
                if (err) {
                    console.error("❌ Database Error (logFoodEntry):", err);
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    },

    // ✅ Fetch food logs for a user on a specific date
    getFoodEntriesByDate: (userId, date) => {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT * FROM food_entries WHERE user_id = ? AND date = ? 
                ORDER BY meal_type ASC
            `;
            connection.query(query, [userId, date], (err, results) => {
                if (err) {
                    console.error("❌ Database Error (getFoodEntriesByDate):", err);
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
    },

    // ✅ Update daily summary after logging food
    updateDailySummary: (userId, date, calories, protein, carbs, fats) => {
        return new Promise((resolve, reject) => {
            const query = `
                INSERT INTO daily_summary (user_id, date, total_calories, total_protein, total_carbs, total_fats)
                VALUES (?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE 
                    total_calories = total_calories + VALUES(total_calories),
                    total_protein = total_protein + VALUES(total_protein),
                    total_carbs = total_carbs + VALUES(total_carbs),
                    total_fats = total_fats + VALUES(total_fats)
            `;
            connection.query(query, [userId, date, calories, protein, carbs, fats], (err, result) => {
                if (err) {
                    console.error("❌ Database Error (updateDailySummary):", err);
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    },

    // ✅ Fetch daily macro summary for a user
    getDailySummaryByDate: (userId, date) => {
        return new Promise((resolve, reject) => {
            const query = `
                 SELECT 
                ROUND(SUM(total_calories), 1) AS total_calories,
                ROUND(SUM(total_protein), 1) AS total_protein,
                ROUND(SUM(total_carbs), 1) AS total_carbs,
                ROUND(SUM(total_fats), 1) AS total_fats
            FROM daily_summary
            WHERE user_id = ? AND date = ?;
            `;
            connection.query(query, [userId, date], (err, results) => {
                if (err) {
                    console.error("❌ Database Error (getDailySummaryByDate):", err);
                    reject(err);
                } else {
                    resolve(results.length > 0 ? results[0] : null);
                }
            });
        });
    }
};

module.exports = Food;
