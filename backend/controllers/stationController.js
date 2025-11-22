const { getAllStations } = require('../dataLoader');

// @desc    Get all stations
// @route   GET /api/stations
// @access  Public
const getAllStationsHandler = async (req, res) => {
    try {
        // If query param 'search' is present, filter by name/code
        const { search } = req.query;
        let stations = getAllStations();

        if (search) {
            const lowerSearch = search.toLowerCase();
            stations = stations.filter(s =>
                s.code.toLowerCase().includes(lowerSearch) ||
                s.name.toLowerCase().includes(lowerSearch)
            );
        }

        // Sort by name
        stations.sort((a, b) => a.name.localeCompare(b.name));

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
    getAllStations: getAllStationsHandler
};
