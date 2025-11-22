const mongoose = require('mongoose');

const routeStationSchema = new mongoose.Schema({
    stationCode: { type: String, required: true },
    stationName: String,
    arrivalTime: String, // HH:mm
    departureTime: String, // HH:mm
    distance: Number, // km from source
    day: Number, // Day of journey (1, 2, etc.)
    haltTime: String // Duration of halt
}, { _id: false });

const trainSchema = new mongoose.Schema({
    trainNumber: {
        type: String,
        required: true,
        unique: true,
        index: true,
        trim: true
    },
    trainName: {
        type: String,
        required: true,
        trim: true
    },
    type: String, // Express, Superfast, etc.
    source: {
        code: String,
        name: String,
        departureTime: String
    },
    destination: {
        code: String,
        name: String,
        arrivalTime: String
    },
    runningDays: [String], // ["Mon", "Tue", ...]
    route: [routeStationSchema],
    isActive: {
        type: Boolean,
        default: true
    },
    lastUpdated: Date
}, {
    timestamps: true
});

// Index for search
trainSchema.index({ trainName: 'text', trainNumber: 'text' });

module.exports = mongoose.model('Train', trainSchema);
