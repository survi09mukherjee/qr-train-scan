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
        const stationsDataPath = path.join(__dirname, 'data/stations.json');

        // 1. Load Stations
        if (fs.existsSync(stationsDataPath)) {
            const stationsRaw = fs.readFileSync(stationsDataPath, 'utf8');
            const stations = JSON.parse(stationsRaw);
            // Map to our internal format
            stationsData = stations.map(s => ({
                code: s.code,
                name: s.name,
                location: {
                    type: 'Point',
                    coordinates: s.location && s.location.coordinates ? s.location.coordinates : [78.9629, 20.5937] // Default to India center if missing
                },
                weather: "Sunny" // Default weather
            }));
            console.log(`Loaded ${stationsData.length} stations from stations.json`);
        }

        // 2. Load Trains
        if (fs.existsSync(trainsDataPath)) {
            const trainsRaw = fs.readFileSync(trainsDataPath, 'utf8');
            const trainsJson = JSON.parse(trainsRaw);
            const trainsList = trainsJson.trains || [];

            trainsData = trainsList.map(t => {
                // Default Route (MAS -> CBE) for context
                // In a real app, this would come from the DB or be dynamic
                const defaultRouteCodes = ['MAS', 'AJJ', 'KPD', 'SA', 'ED', 'TUP', 'CBE'];
                const fullRoute = defaultRouteCodes.map(code => {
                    const station = stationsData.find(s => s.code === code);
                    return {
                        code: code,
                        name: station ? station.name : code,
                        location: station ? station.location.coordinates : [78.9629, 20.5937],
                        weather: station ? station.weather : "Sunny",
                        arrivalTime: code === 'CBE' ? t.arrival_time : null,
                        departureTime: code === 'MAS' ? t.departure_time : null,
                        distance: "0 km" // Placeholder
                    };
                });

                return {
                    trainNumber: t.train_number,
                    trainName: t.train_name,
                    type: t.type || 'Express',
                    source: {
                        code: 'MAS',
                        name: 'Chennai Central',
                        departureTime: t.departure_time
                    },
                    destination: {
                        code: 'CBE',
                        name: 'Coimbatore Junction',
                        arrivalTime: t.arrival_time
                    },
                    runningDays: t.runningDays || ['Daily'],
                    route: fullRoute,
                    isActive: true,
                    duration: t.duration
                };
            });
            console.log(`Loaded ${trainsData.length} trains from trains.json`);
        }

        // 3. Override/Merge with Project Data (User provided specific data)
        if (fs.existsSync(projectDataPath)) {
            const projectDataRaw = fs.readFileSync(projectDataPath, 'utf8');
            const projectData = JSON.parse(projectDataRaw);

            if (projectData.stations) {
                const projectStations = projectData.stations.map(s => ({
                    code: s.code,
                    name: s.station_name,
                    location: {
                        type: 'Point',
                        coordinates: [s.longitude, s.latitude]
                    },
                    weather: s.weather_condition
                }));

                // Merge/Overwrite stations
                projectStations.forEach(ps => {
                    const index = stationsData.findIndex(s => s.code === ps.code);
                    if (index !== -1) {
                        stationsData[index] = ps;
                    } else {
                        stationsData.push(ps);
                    }
                });
                console.log(`Merged ${projectStations.length} stations from project_data.json`);
            }

            if (projectData.trains) {
                const projectTrains = projectData.trains.map(t => {
                    const fullRoute = stationsData.filter(s =>
                        // For this specific dataset, we assume the route includes all these stations
                        // This logic might need refinement if the project data implies a specific subset
                        // But based on previous context, the user provided a list of stations for the route.
                        // Let's assume the project data stations ARE the route for these trains.
                        projectData.stations.some(ps => ps.code === s.code)
                    ).map(s => ({
                        code: s.code,
                        name: s.name,
                        location: s.location.coordinates,
                        weather: s.weather,
                        // Add arrival/departure if available in project data, else mock or leave empty
                    }));

                    return {
                        trainNumber: t.train_number,
                        trainName: t.train_name,
                        type: 'Express',
                        source: {
                            code: 'MAS',
                            name: 'Chennai Central',
                            departureTime: t.departure_time
                        },
                        destination: {
                            code: 'CBE',
                            name: 'Coimbatore Junction',
                            arrivalTime: t.arrival_time
                        },
                        runningDays: ['Daily'],
                        route: fullRoute,
                        isActive: true,
                        duration: t.duration
                    };
                });

                // Merge/Overwrite trains
                projectTrains.forEach(pt => {
                    const index = trainsData.findIndex(t => t.trainNumber === pt.trainNumber);
                    if (index !== -1) {
                        trainsData[index] = pt;
                    } else {
                        trainsData.push(pt);
                    }
                });
                console.log(`Merged ${projectTrains.length} trains from project_data.json`);
            }
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
            // Check if source and destination match the train's route (name or code)
            const sourceIndex = t.route.findIndex(s =>
                s.name.toLowerCase().includes(lowerSource) ||
                s.code.toLowerCase() === lowerSource
            );
            const destIndex = t.route.findIndex(s =>
                s.name.toLowerCase().includes(lowerDest) ||
                s.code.toLowerCase() === lowerDest
            );

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
