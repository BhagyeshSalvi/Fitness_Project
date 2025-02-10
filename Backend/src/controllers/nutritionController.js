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
