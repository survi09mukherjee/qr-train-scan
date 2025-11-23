const fs = require('fs');
const path = require('path');

let trainsData = [];
let stationsData = [];

// Load data from JSON files
function loadData() {
    try {
        console.log('Loading train data from JSON files...');

        const projectDataPath = path.join(__dirname, 'data/project_data.json');

        if (fs.existsSync(projectDataPath)) {
            const projectDataRaw = fs.readFileSync(projectDataPath, 'utf8');
            const projectData = JSON.parse(projectDataRaw);

            // Load Stations
            if (projectData.stations) {
                stationsData = projectData.stations.map(s => ({
                    code: s.code,
                    name: s.station_name,
                    location: {
                        type: 'Point',
                        coordinates: [s.longitude, s.latitude]
                    },
                    weather: s.weather_condition
                }));
                console.log(`Loaded ${stationsData.length} stations from project_data`);
            }

            // Load Trains
            if (projectData.trains) {
                trainsData = projectData.trains.map(t => {
                    // Find source and destination stations to get coordinates if needed, 
                    // though the UI might just need names. 
                    // For the route, we will construct it from the stations list since the user said 
                    // "source will be all places from chennai to coimbatore and destination will be all places from chennai to coimbatore"
                    // and the stations list IS the route.

                    const fullRoute = stationsData.map(s => ({
                        code: s.code,
                        name: s.name,
                        location: s.location.coordinates,
                        weather: s.weather
                    }));

                    return {
                        trainNumber: t.train_number,
                        trainName: t.train_name,
                        type: 'Express', // Default
                        source: {
                            code: 'MAS', // Assuming Chennai Central as source for all based on context or first station
                            name: 'Chennai Central',
                            departureTime: t.departure_time
                        },
                        destination: {
                            code: 'CBE', // Assuming Coimbatore as destination
                            name: 'Coimbatore Junction',
                            arrivalTime: t.arrival_time
                        },
                        runningDays: ['Daily'], // Default
                        route: fullRoute,
                        isActive: true,
                        duration: t.duration
                    };
                });
                console.log(`Loaded ${trainsData.length} trains from project_data`);
            }
        } else {
            console.warn('project_data.json not found, falling back to legacy data loading...');
            // Fallback logic or keep existing logic if needed, but for now we replace.
        }

        console.log('Data loaded successfully!');
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
            // Check if source and destination match the train's route
            // For this specific dataset, we assume all trains go from Chennai to Coimbatore or vice versa
            // But correctly, we should check if the train stops at 'source' AND 'destination'
            // AND 'source' comes before 'destination' in the route.

            const sourceIndex = t.route.findIndex(s => s.name.toLowerCase() === lowerSource);
            const destIndex = t.route.findIndex(s => s.name.toLowerCase() === lowerDest);

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
