const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.register = async (req, res) => {
    try {
        const { email, password, firstName, lastName } = req.body;

        if (!email || !password || !firstName || !lastName) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Check if email already exists
        const existingUser = await User.findByEmail(email);
        if (existingUser.length > 0) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create new user
        const newUser = await User.create(email, hashedPassword, firstName, lastName);
        console.log('🔹 New User:', newUser);
        
        // Generate JWT token for the new user
        const token = jwt.sign({ userID: newUser.insertId, firstname: firstName }, process.env.JWT_SECRET, { expiresIn: '1h' });
        console.log('🔹 Generated Token:', token);
        res.status(201).json({ message: 'User registered successfully', token});

    } catch (error) {
        console.error('Register Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.login = async (req, res) => {
    try {
        const email = req.body.email.toLowerCase(); // ✅ Convert input email to lowercase
        const password = req.body.password;

        console.log('🔹 Incoming login request for:', email);

        const results = await User.findByEmail(email);
        console.log('🔹 User lookup result:', results);

        if (!results || !Array.isArray(results) || results.length === 0) {
            console.log('❌ No user found for email:', email);
            return res.status(401).json({ error: 'Email does not exist' });
        }

        const user = results[0];

        const isMatch = await bcrypt.compare(password, user.password);
        console.log('🔹 Password match:', isMatch);

        if (!isMatch) {
            console.log('❌ Incorrect password for:', email);
            return res.status(401).json({ error: 'Invalid password' });
        }

        const token = jwt.sign({ userID: user.id, firstname: user.firstname }, process.env.JWT_SECRET, { expiresIn: '1h' });
        console.log('✅ Login successful. Token generated:', token);

        res.json({ message: 'Login successful', token });

    } catch (error) {
        console.error('❌ Login Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getUserInfoById = async (req, res) => {
    try {
        const { userId } = req.params;
        const result = await User.findById(userId);
        if (!result || result.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json(result[0]);
    } catch (error) {
        console.error("❌ Error fetching user info:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

exports.changePassword = async (req, res) => {
  try {
    const { userID } = req.body; // sent from decoded token
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const users = await User.findById(userID);
    if (!users || users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = users[0];

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    const sql = 'UPDATE users SET password = ? WHERE id = ?';

    require('../config/db').query(sql, [hashedNewPassword, userID], (err, result) => {
      if (err) {
        console.error('❌ Password Update Error:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
      return res.status(200).json({ message: 'Password updated successfully' });
    });
  } catch (error) {
    console.error('❌ Change Password Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};





