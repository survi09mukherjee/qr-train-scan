const { getAllTrains, getTrainByNumber, searchTrains } = require('../dataLoader');
const { getLiveStatus } = require('../services/liveStatusService');

// @desc    Get all trains (with pagination)
// @route   GET /api/trains
// @access  Public
const getAllTrainsHandler = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;

        const result = getAllTrains(page, limit);

        res.json({
            success: true,
            count: result.trains.length,
            total: result.total,
            page: result.page,
            pages: result.pages,
            data: result.trains
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
        const train = getTrainByNumber(req.params.trainNumber);

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

        console.log(`[DEBUG] Sending train data for ${req.params.trainNumber}:`, {
            hasRoute: !!train.route,
            routeLength: train.route ? train.route.length : 0,
            trainName: train.trainName
        });

        res.json({
            success: true,
            data: {
                ...train,
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
const searchTrainsHandler = async (req, res) => {
    try {
        const { query } = req.query;

        if (!query) {
            return res.status(400).json({ success: false, error: 'Please provide a search query' });
        }

        const trains = searchTrains(query);

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
    getAllTrains: getAllTrainsHandler,
    getTrain,
    searchTrains: searchTrainsHandler
};
