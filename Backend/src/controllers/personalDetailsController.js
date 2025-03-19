const PersonalDetails = require('../models/PersonalDetails');

exports.savePersonalDetails = async (req, res) => {
    let { user_id, gender, weight, height, age, activity_level, goal } = req.body;

    // ✅ Validate required fields
    if (!user_id || !gender || !weight || !height || !age || !activity_level || !goal) {
        return res.status(400).json({ error: "All fields are required" });
    }

     // ✅ Convert height from feet to cm if less than a certain value (like 10)
     height = height > 10 ? height : (height * 30.48);

    try {
        // ✅ Call model to insert/update
        await PersonalDetails.saveOrUpdate(user_id, gender, weight, height, age, activity_level, goal);

        res.status(200).json({ message: "Personal details saved successfully!" });
    } catch (error) {
        console.error("❌ Error saving personal details:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

exports.getPersonalDetails = async (req, res) => {
    const { user_id } = req.query; 

    if (!user_id) {
        return res.status(400).json({ error: "user_id is required" });
    }

    try {
        const userDetails = await PersonalDetails.getUserPersonalDetails(user_id);
        if (!userDetails) {
            return res.status(404).json({ error: "Personal details not found" });
        }
        res.status(200).json(userDetails);
    } catch (error) {
        console.error("❌ Error fetching personal details:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
