const Notification = require('../models/Notification');

exports.getPreferences = async (req, res) => {
  try {
    const prefs = await Notification.getPreferences(req.params.userId);
    res.json(prefs || {});
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch preferences" });
  }
};

exports.savePreferences = async (req, res) => {
  try {
    const { user_id, ...prefs } = req.body;
    await Notification.savePreferences(user_id, prefs);
    res.json({ message: "Preferences saved successfully" });
  } catch (err) {
    console.error("❌ Error saving preferences:", err);
    res.status(500).json({ error: "Failed to save preferences" });
  }
};
