require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const nutritionRoutes = require('./routes/nutritionRoutes');
const workoutRoutes = require('./routes/workoutRoutes');
const foodRoutes = require('./routes/foodRoutes')
const personalDetailsRoutes = require('./routes/personalDetailsRoutes')
const activityLogRoutes = require('./routes/activityRoutes')
const notificationRoutes = require('./routes/notificationRoutes');

const app = express();

// Middleware
app.use(cors());
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
app.use('/api/personalDetails', personalDetailsRoutes)
app.use('/api/activity', activityLogRoutes)
app.use('/api/notifications', notificationRoutes);



// Start the server
const PORT = process.env.PORT || 5000;
app.listen(5000, '0.0.0.0', () => console.log('Server running on all network interfaces'));

