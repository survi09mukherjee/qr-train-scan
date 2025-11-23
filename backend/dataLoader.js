const fs = require('fs');
const path = require('path');

let trainsData = [];
let stationsData = [];

// Load data from JSON files
function loadData() {
    try {
        console.log('Loading train data from JSON files...');

        const projectDataPath = path.join(__dirname, 'data/project_data.json');
        const trainsDataPath = path.join(__dirname, 'data/trains.json');

        // 1. Load Stations (project_data.json is now the master for stations)
        if (fs.existsSync(projectDataPath)) {
            const stationsRaw = fs.readFileSync(projectDataPath, 'utf8');
            const stationsJson = JSON.parse(stationsRaw);

            // Handle both array and object wrapper formats
            const stationsList = Array.isArray(stationsJson) ? stationsJson : (stationsJson.stations || []);

            stationsData = stationsList.map(s => ({
                code: s.code,
                name: s.name || s.station_name,
                location: {
                    type: 'Point',
                    coordinates: [s.longitude, s.latitude]
                },
                weather: s.weather_condition || "Sunny"
            }));
            console.log(`Loaded ${stationsData.length} stations from project_data.json`);
        }

        // 2. Load Trains (trains.json is now the master for trains)
        if (fs.existsSync(trainsDataPath)) {
            const trainsRaw = fs.readFileSync(trainsDataPath, 'utf8');
            const trainsJson = JSON.parse(trainsRaw);
            const trainsList = Array.isArray(trainsJson) ? trainsJson : (trainsJson.trains || []);

            trainsData = trainsList.map(t => {
                // Map route station codes to full station objects
                const fullRoute = t.routeStations.map((code, index) => {
                    const station = stationsData.find(s => s.code === code);
                    const distance = t.segmentDistancesKm && t.segmentDistancesKm[index] !== undefined ? t.segmentDistancesKm[index] : 0;

                    return {
                        code: code,
                        name: station ? station.name : code,
                        location: station ? station.location.coordinates : [78.9629, 20.5937],
                        weather: station ? station.weather : "Sunny",
                        distanceToNextKm: distance
                    };
                });

                const currentStationIndex = t.currentStationIndex || 0;
                const currentStation = fullRoute[currentStationIndex];
                const previousStations = fullRoute.slice(0, currentStationIndex).map(s => s.code);
                const nextStations = fullRoute.slice(currentStationIndex + 1).map(s => s.code);

                return {
                    trainNumber: t.trainNumber,
                    trainName: t.trainName,
                    pnrExample: t.pnrExample,
                    source: {
                        code: t.source,
                        name: stationsData.find(s => s.code === t.source)?.name || t.source,
                        departureTime: t.departureTime
                    },
                    destination: {
                        code: t.destination,
                        name: stationsData.find(s => s.code === t.destination)?.name || t.destination,
                        arrivalTime: t.arrivalTime
                    },
                    duration: t.duration,
                    route: fullRoute,
                    currentStationIndex: currentStationIndex,
                    currentStation: {
                        code: currentStation.code,
                        name: currentStation.name,
                        weather: currentStation.weather
                    },
                    previousStations: previousStations,
                    nextStations: nextStations,
                    isActive: true
                };
            });
            console.log(`Loaded ${trainsData.length} trains from trains.json`);
        }

        console.log(`Total Data Loaded: ${trainsData.length} Trains, ${stationsData.length} Stations`);
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

// Get all trains with pagination
function getAllTrains(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const paginatedTrains = trainsData.slice(skip, skip + limit);

    return {
        trains: paginatedTrains,
        total: trainsData.length,
        page,
        pages: Math.ceil(trainsData.length / limit)
    };
}

// Get train by number
function getTrainByNumber(trainNumber) {
    return trainsData.find(t => t.trainNumber === trainNumber);
}

// Search trains
function searchTrains(query, source, destination) {
    let filteredTrains = trainsData;

    if (source && destination) {
        const lowerSource = source.toLowerCase();
        const lowerDest = destination.toLowerCase();

        filteredTrains = filteredTrains.filter(t => {
            const routeCodes = t.route.map(s => s.code.toLowerCase());
            const routeNames = t.route.map(s => s.name.toLowerCase());

            const sourceIndex = routeCodes.indexOf(lowerSource) !== -1 ? routeCodes.indexOf(lowerSource) : routeNames.findIndex(n => n.includes(lowerSource));
            const destIndex = routeCodes.indexOf(lowerDest) !== -1 ? routeCodes.indexOf(lowerDest) : routeNames.findIndex(n => n.includes(lowerDest));

            return sourceIndex !== -1 && destIndex !== -1 && sourceIndex < destIndex;
        });
    }

    if (query) {
        const lowerQuery = query.toLowerCase();
        filteredTrains = filteredTrains.filter(t =>
            t.trainNumber.toLowerCase().includes(lowerQuery) ||
            t.trainName.toLowerCase().includes(lowerQuery)
        );
    }

    return filteredTrains;
}

// Get station by code
function getStationByCode(code) {
    return stationsData.find(s => s.code === code);
}

// Get all stations
function getAllStations() {
    return stationsData;
}

module.exports = {
    loadData,
    getAllTrains,
    getTrainByNumber,
    searchTrains,
    getStationByCode,
    getAllStations
};
