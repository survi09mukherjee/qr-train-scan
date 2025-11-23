require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { loadData } = require('./dataLoader');

// Import Routes
const trainRoutes = require('./routes/trainRoutes');
const stationRoutes = require('./routes/stationRoutes');
const scanRoutes = require('./routes/scanRoutes');

// Initialize App
const app = express();
const PORT = process.env.PORT || 5000;

// Load data from JSON files
console.log('Loading data from JSON files...');
loadData();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/trains', trainRoutes);
app.use('/api/stations', stationRoutes);
app.use('/api/qrs', scanRoutes);

// Basic Route
app.get('/', (req, res) => {
    res.send('Indian Train Data API is running...');
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, error: 'Server Error' });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
