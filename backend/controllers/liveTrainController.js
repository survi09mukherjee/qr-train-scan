const { getTrainByNumber, getStationByCode } = require('../dataLoader');

// Simulate GPS coordinates along route
function simulateTrainLocation(train) {
    if (!train || !train.route || train.route.length < 2) {
        return { lat: 20.5937, lng: 78.9629 }; // Default India center
    }

    // For demo, pick a random position between two stations
    const routeIndex = Math.floor(Math.random() * (train.route.length - 1));
    const currentStation = train.route[routeIndex];
    const nextStation = train.route[routeIndex + 1];

    // Simple interpolation (in real app, use actual GPS)
    const lat = 20.5937 + (Math.random() * 10 - 5); // Random around India
    const lng = 78.9629 + (Math.random() * 10 - 5);

    return { lat, lng, currentStation, nextStation, routeIndex };
}

// Simulate weather data
function generateWeather() {
    const conditions = ['Sunny', 'Cloudy', 'Rainy', 'Partly Cloudy'];
    return {
        temp: Math.floor(Math.random() * 15) + 20, // 20-35°C
        humidity: Math.floor(Math.random() * 40) + 40, // 40-80%
        windSpeed: Math.floor(Math.random() * 20) + 5, // 5-25 km/h
        condition: conditions[Math.floor(Math.random() * conditions.length)]
    };
}

// @desc    Get live train tracking data
// @route   GET /api/trains/:trainNumber/live
// @access  Public
const getLiveTrainData = (req, res) => {
    try {
        const { trainNumber } = req.params;
        const train = getTrainByNumber(trainNumber);

        if (!train) {
            return res.status(404).json({
                success: false,
                error: 'Train not found'
            });
        }

        const location = simulateTrainLocation(train);
        const weather = generateWeather();

        // Calculate previous and next stations
        // Handle case where route might be empty
        let previousStation, upcomingStation;

        if (train.route && train.route.length > 0) {
            const routeIndex = location.routeIndex || 0;
            previousStation = train.route[Math.max(0, routeIndex - 1)] || train.route[0];
            upcomingStation = train.route[Math.min(train.route.length - 1, routeIndex + 1)] || train.route[train.route.length - 1];
        } else {
            // Fallback to source and destination if route is empty
            previousStation = {
                name: train.source.name,
                code: train.source.code,
                departureTime: train.source.departureTime || 'N/A'
            };
            upcomingStation = {
                name: train.destination.name,
                code: train.destination.code,
                arrivalTime: train.destination.arrivalTime || 'N/A',
                distance: 0
            };
        }

        // Get station coordinates from stations data
        const previousStationCode = previousStation.code || previousStation.stationCode;
        const upcomingStationCode = upcomingStation.code || upcomingStation.stationCode;

        const previousStationData = previousStationCode ? getStationByCode(previousStationCode) : null;
        const upcomingStationData = upcomingStationCode ? getStationByCode(upcomingStationCode) : null;

        // Extract coordinates (GeoJSON format: [lng, lat])
        const previousStationCoords = previousStationData?.location?.coordinates || null;
        const upcomingStationCoords = upcomingStationData?.location?.coordinates || null;

        // Build response
        const liveData = {
            trainName: train.trainName,
            trainNumber: train.trainNumber,
            pnr: `PNR${Math.floor(Math.random() * 9000000) + 1000000}`, // Random PNR for demo
            lat: location.lat,
            lng: location.lng,
            nearestStation: location.currentStation?.name || train.source.name,
            etaFinalDestination: train.destination.arrivalTime || 'N/A',
            speed: Math.floor(Math.random() * 60) + 40, // 40-100 km/h
            timestamp: new Date().toISOString(),
            source: train.source.name,
            destination: train.destination.name,
            finalStop: train.destination.name,
            previousStation: {
                name: previousStation.name || previousStation.stationName || 'N/A',
                departureTime: previousStation.departureTime || 'N/A',
                lat: previousStationCoords ? previousStationCoords[1] : null,
                lng: previousStationCoords ? previousStationCoords[0] : null
            },
            upcomingStation: {
                name: upcomingStation.name || upcomingStation.stationName || 'N/A',
                distance: upcomingStation.distance ? `${upcomingStation.distance} km` : 'N/A',
                eta: upcomingStation.arrivalTime || 'N/A',
                lat: upcomingStationCoords ? upcomingStationCoords[1] : null,
                lng: upcomingStationCoords ? upcomingStationCoords[0] : null
            },
            currentLocation: {
                name: location.currentStation?.name || train.source.name,
                lat: location.lat,
                lng: location.lng
            },
            weather: weather,
            timezone: 'IST (UTC+05:30)',
            nextMajorStops: train.route && train.route.length > 0
                ? train.route.slice((location.routeIndex || 0) + 1, (location.routeIndex || 0) + 4).map(s => s.name || s.stationName).filter(Boolean)
                : [train.destination.name]
        };

        res.json({
            success: true,
            data: liveData
        });

    } catch (error) {
        console.error('Error fetching live train data:', error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

module.exports = {
    getLiveTrainData
};
