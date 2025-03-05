require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const nutritionRoutes = require('./routes/nutritionRoutes');
const workoutRoutes = require('./routes/workoutRoutes');
const foodRoutes = require('./routes/foodRoutes')
const app = express();

// Middleware
app.use(cors({ origin: '*' })); 
app.use(express.json());

app.use((req, res, next) => {
    console.log('Incoming Request:', req.method, req.url);
    console.log('Request Body:', req.body);
    next();
});


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/nutrition', nutritionRoutes);
app.use('/api/workout',workoutRoutes);
app.use('/api/food', foodRoutes)

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(5000, '0.0.0.0', () => console.log('Server running on all network interfaces'));

