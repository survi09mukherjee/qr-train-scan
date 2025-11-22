const Train = require('../models/Train');
const { getLiveStatus } = require('../services/liveStatusService');

// @desc    Get all trains (with pagination)
// @route   GET /api/trains
// @access  Public
const getAllTrains = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const trains = await Train.find()
            .select('trainNumber trainName type source destination runningDays')
            .skip(skip)
            .limit(limit);

        const total = await Train.countDocuments();

        res.json({
            success: true,
            count: trains.length,
            total,
            page,
            pages: Math.ceil(total / limit),
            data: trains
        });
    } catch (error) {
        console.error('Error fetching trains:', error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Get single train by number
// @route   GET /api/trains/:trainNumber
// @access  Public
const getTrain = async (req, res) => {
    try {
        const train = await Train.findOne({ trainNumber: req.params.trainNumber });

        if (!train) {
            return res.status(404).json({ success: false, error: 'Train not found' });
        }

        let liveStatus = {};
        try {
            liveStatus = await getLiveStatus(req.params.trainNumber);
        } catch (error) {
            console.error("Failed to get live status:", error);
            liveStatus = { status: "Unknown", error: "Could not fetch live status" };
        }

        res.json({
            success: true,
            data: {
                ...train.toObject(),
                live_status: liveStatus
            }
        });
    } catch (error) {
        console.error('Error fetching train:', error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Search trains by name or number
// @route   GET /api/trains/search
// @access  Public
const searchTrains = async (req, res) => {
    try {
        const { query } = req.query;

        if (!query) {
            return res.status(400).json({ success: false, error: 'Please provide a search query' });
        }

        const trains = await Train.find({
            $or: [
                { trainNumber: { $regex: query, $options: 'i' } },
                { trainName: { $regex: query, $options: 'i' } }
            ]
        }).select('trainNumber trainName source destination');

        res.json({
            success: true,
            count: trains.length,
            data: trains
        });
    } catch (error) {
        console.error('Error searching trains:', error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

module.exports = {
    getAllTrains,
    getTrain,
    searchTrains
};
