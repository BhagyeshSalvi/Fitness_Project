const Workout = require('../models/Workout');

// ✅ 1. Save or Update User’s Selected Workout Days
exports.saveWorkout = async (req, res) => {
    try {
        const { userId, daysSelected, workoutDays } = req.body;

        if (!userId || !daysSelected || !workoutDays) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        await Workout.saveOrUpdate(userId, daysSelected, workoutDays);
        res.status(200).json({ message: 'Workout data saved successfully' });

    } catch (error) {
        console.error('❌ Error saving workout:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// ✅ 2. Get Workout Data for a User
exports.getWorkout = async (req, res) => {
    try {
        const { userId } = req.params;

        const workout = await Workout.findByUserId(userId);

        if (!workout) {
            return res.status(404).json({ error: 'No workout data found for this user' });
        }

        res.status(200).json({ workout });

    } catch (error) {
        console.error('❌ Error fetching workout:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// ✅ 3. Generate Recommended Workout Plan
exports.generateWorkoutPlan = async (req, res) => {
    try {
        const { userId } = req.params;

        const workout = await Workout.findByUserId(userId);
        if (!workout) {
            return res.status(404).json({ error: 'No workout data found for this user' });
        }

        const recommendedPlan = generatePlan(workout.days_selected);

        res.status(200).json(recommendedPlan);

    } catch (error) {
        console.error('❌ Error generating workout plan:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// ✅ 4. Save Finalized Workout Plan
exports.saveFinalWorkoutPlan = async (req, res) => {
    try {
        const { userId, workoutPlan } = req.body;

        if (!userId || !workoutPlan) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        await Workout.saveFinalWorkoutPlan(userId, workoutPlan);
        res.status(200).json({ message: 'Workout plan saved successfully' });

    } catch (error) {
        console.error('❌ Error saving workout plan:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// ✅ Helper Function: Generate Workout Plan with Specific Exercises
const generatePlan = (daysSelected) => {
    const workoutSplits = {
        1: { 
            split: "Full Body", 
            plan: ["Squats", "Bench Press", "Pull-Ups", "Deadlifts", "Overhead Press"] 
        },
        2: { 
            split: "Upper/Lower", 
            plan: { 
                "Day 1 (Upper)": ["Bench Press", "Pull-Ups", "Overhead Press", "Barbell Rows"], 
                "Day 2 (Lower)": ["Squats", "Deadlifts", "Lunges", "Calf Raises"]
            } 
        },
        3: { 
            split: "Push-Pull-Legs", 
            plan: { 
                "Day 1 (Push)": ["Bench Press", "Overhead Press", "Dips"], 
                "Day 2 (Pull)": ["Pull-Ups", "Barbell Rows", "Bicep Curls"], 
                "Day 3 (Legs)": ["Squats", "Deadlifts", "Leg Curls"]
            } 
        },
        4: { 
            split: "Upper/Lower (Twice per Week)", 
            plan: { 
                "Day 1 & 3 (Upper)": ["Bench Press", "Pull-Ups", "Dumbbell Rows"], 
                "Day 2 & 4 (Lower)": ["Squats", "Deadlifts", "Bulgarian Split Squats"]
            } 
        },
        5: { 
            split: "Full Body + Focus", 
            plan: { 
                "Day 1 (Full Body)": ["Squats", "Pull-Ups", "Overhead Press"], 
                "Day 2 (Focus - Chest, Arms)": ["Incline Dumbbell Press", "Triceps Dips", "Bicep Curls"], 
                "Day 3 (Focus - Back, Core)": ["Lat Pulldowns", "Deadlifts", "Planks"]
            } 
        },
        6: { 
            split: "Push-Pull-Legs (Twice per Week)", 
            plan: { 
                "Day 1 & 4 (Push)": ["Bench Press", "Overhead Press", "Triceps Extensions"], 
                "Day 2 & 5 (Pull)": ["Dumbbell Rows", "Barbell Curls", "Face Pulls"], 
                "Day 3 & 6 (Legs)": ["Deadlifts", "Lunges", "Calf Raises"]
            } 
        },
        7: { 
            split: "Push-Pull-Legs + Active Recovery", 
            plan: { 
                "Day 1 (Push)": ["Incline Dumbbell Press", "Triceps Dips", "Lateral Raises"], 
                "Day 2 (Pull)": ["Lat Pulldowns", "Barbell Rows", "Bicep Curls"], 
                "Day 3 (Legs)": ["Romanian Deadlifts", "Lunges", "Calf Raises"], 
                "Day 4 (Active Recovery)": ["Yoga", "Foam Rolling", "Light Cardio"], 
                "Day 5 (Push)": ["Flat Bench Press", "Shoulder Press", "Cable Flys"], 
                "Day 6 (Pull)": ["Pull-Ups", "Face Pulls", "Hammer Curls"], 
                "Day 7 (Legs)": ["Back Squats", "Leg Press", "Planks"]
            } 
        }
    };

    return workoutSplits[daysSelected] || { split: "Unknown", plan: [] };
};
