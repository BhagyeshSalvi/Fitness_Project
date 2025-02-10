const Nutrition = require('../models/Nutrition');

// Save or update nutrition data
exports.saveNutrition = async (req, res) => {
    try {
        const { userId, calories, protein, carbs, fats } = req.body;

        // Validate required fields
        if (!userId || !calories || !protein || !carbs || !fats) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Save or update the nutrition data
        await Nutrition.saveOrUpdate(userId, calories, protein, carbs, fats);
        res.status(200).json({ message: 'Nutrition data saved successfully' });

    } catch (error) {
        console.error('❌ Error saving nutrition:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get nutrition data for a user
exports.getNutrition = async (req, res) => {
    try {
        const { userId } = req.params;

        // Fetch nutrition data
        const nutrition = await Nutrition.findByUserId(userId);

        if (!nutrition) {
            return res.status(404).json({ error: 'No nutrition data found for this user' });
        }

        res.status(200).json({ nutrition });

    } catch (error) {
        console.error('❌ Error fetching nutrition:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


//Calculate Nutrition based on data
exports.calculateNutrition = async (req, res) => {
    try {
        const { gender, weight, height, age, activityLevel, goal } = req.body;

        // Validate required fields
        if (!gender || !weight || !height || !age || !activityLevel || !goal) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Convert height to cm if given in feet
        const heightCm = height > 10 ? height : height * 30.48; // Assuming input might be in feet

        // Step 1: Calculate BMR
        let BMR;
        if (gender === 'male') {
            BMR = (10 * weight) + (6.25 * heightCm) - (5 * age) + 5;
        } else if (gender === 'female') {
            BMR = (10 * weight) + (6.25 * heightCm) - (5 * age) - 161;
        } else {
            return res.status(400).json({ error: 'Invalid gender' });
        }

        // Step 2: Activity Multiplier
        const activityMultipliers = {
            sedentary: 1.2,
            lightly_active: 1.375,
            moderately_active: 1.55,
            very_active: 1.725,
            super_active: 1.9
        };

        if (!activityMultipliers[activityLevel]) {
            return res.status(400).json({ error: 'Invalid activity level' });
        }

        const TDEE = BMR * activityMultipliers[activityLevel];

        // Step 3: Adjust Calories for Goal
        let targetCalories = TDEE;
        if (goal === 'weight_loss') {
            targetCalories -= 500; // Moderate deficit
        } else if (goal === 'weight_gain') {
            targetCalories += 300; // Moderate surplus
        } else if (goal !== 'maintain') {
            return res.status(400).json({ error: 'Invalid goal' });
        }

        // Step 4: Macronutrient Breakdown
        const protein = Math.round(weight * 2); // 2g protein per kg body weight
        const fats = Math.round(weight * 0.8); // 0.8g fat per kg body weight
        const proteinKcal = protein * 4;
        const fatsKcal = fats * 9;
        const carbsKcal = targetCalories - (proteinKcal + fatsKcal);
        const carbs = Math.round(carbsKcal / 4); // Convert kcal to grams

        // Response JSON
        res.status(200).json({
            calories: Math.round(targetCalories),
            protein,
            carbs,
            fats
        });

    } catch (error) {
        console.error('❌ Error in calculateNutrition:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
