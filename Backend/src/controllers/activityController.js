const Activity = require('../models/Activity');
const PersonalDetails = require('../models/PersonalDetails'); // To fetch user weight

// MET values table (expand as needed)
const MET_VALUES = {
    'Running': 7.0,
    'Walking': 3.5,
    'Cycling': 6.0,
    'Treadmill': 5.5,
    'Stairmaster': 8.0,
    'Jump Rope': 10.0,
    'Weight Training': 5.0,
    'Swimming': 6.0,
    'HIIT': 8.0
};

exports.logActivity = async (req, res) => {
    try {
        const { user_id, activity_name, duration_minutes, intensity } = req.body;

        if (!user_id || !activity_name || !duration_minutes || !intensity) {
            return res.status(400).json({ error: "Missing required fields." });
        }

        //  Fetch MET base value for the activity
        const baseMET = MET_VALUES[activity_name];
        if (!baseMET) {
            return res.status(400).json({ error: "Invalid activity." });
        }

        //  Fetch user weight dynamically
        const userDetails = await PersonalDetails.getUserPersonalDetails(user_id);
        if (!userDetails || !userDetails.weight) {
            return res.status(404).json({ error: "User personal details not found." });
        }
        const weight = userDetails.weight;

        //  Apply intensity multiplier
        let intensityMultiplier = 1;
        if (intensity === 'moderate') intensityMultiplier = 1.5;
        else if (intensity === 'intense') intensityMultiplier = 2;

        const MET = baseMET * intensityMultiplier;

        //  Calculate calories burned
        const duration_hours = duration_minutes / 60;
        const calories_burned = parseFloat((MET * weight * duration_hours * 1.05).toFixed(2)); // *1.05 factor optional

        //  Fail-safe check to prevent bad DB insert
        if (calories_burned <= 0 || isNaN(calories_burned)) {
            return res.status(400).json({ error: "Invalid calories calculation." });
        }
        
        const today = new Date().toISOString().split('T')[0];

        //  Save to DB
        await Activity.logActivity(user_id, activity_name, duration_minutes, intensity, calories_burned, today);

        res.status(200).json({
            message: "Activity logged successfully!",
            calories_burned
        });

    } catch (err) {
        console.error("❌ Error logging activity:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};
