const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.register = (req, res) => {
    const { email, password, firstName, lastName } = req.body;
    const saltRounds = 10;

    // Hash the password
    bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
        if (err) return res.status(500).json({ error: 'Error hashing password' });

        // Check if the user already exists
        User.findByEmail(email, (err, results) => {
            if (err) return res.status(500).json({ error: 'Database error' });
            if (results.length > 0) return res.status(400).json({ error: 'Email already registered' });

            // Create the user
            User.create(email, hashedPassword, firstName, lastName, (err, result) => {
                if (err) return res.status(500).json({ error: 'Error creating user' });
                res.status(201).json({ message: 'User registered successfully' });
            });
        });
    });
};

exports.login = (req, res) => {
    const { email, password } = req.body;

    // Check if the user exists
    User.findByEmail(email, (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        if (results.length === 0) return res.status(401).json({ error: 'Invalid email or password' });

        const user = results[0];

        // Compare the hashed password
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err || !isMatch) return res.status(401).json({ error: 'Invalid email or password' });

            // Generate a JWT token
            const token = jwt.sign({ userID: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.json({ message: 'Login successful', token });
        });
    });
};
