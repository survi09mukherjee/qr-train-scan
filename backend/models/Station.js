const mongoose = require('mongoose');

const stationSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        index: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    city: String,
    state: String,
    zone: String,
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            index: '2dsphere'
        }
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Station', stationSchema);
