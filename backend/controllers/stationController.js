const Station = require('../models/Station');

// @desc    Get all stations
// @route   GET /api/stations
// @access  Public
const getAllStations = async (req, res) => {
    try {
        // If query param 'search' is present, filter by name/code
        const { search } = req.query;
        let query = {};

        if (search) {
            query = {
                $or: [
                    { code: { $regex: search, $options: 'i' } },
                    { name: { $regex: search, $options: 'i' } }
                ]
            };
        }

        const stations = await Station.find(query).sort({ name: 1 });

        res.json({
            success: true,
            count: stations.length,
            data: stations
        });
    } catch (error) {
        console.error('Error fetching stations:', error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

module.exports = {
    getAllStations
};
