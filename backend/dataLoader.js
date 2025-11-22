const fs = require('fs');
const path = require('path');

let trainsData = [];
let stationsData = [];

// Load data from JSON files
function loadData() {
    try {
        console.log('Loading train data from JSON files...');

        const trainsPath = path.join(__dirname, 'data/trains.json');
        const stationsPath = path.join(__dirname, 'data/stations.json');

        if (fs.existsSync(trainsPath)) {
            const trainsRaw = fs.readFileSync(trainsPath, 'utf8');
            const trainsJson = JSON.parse(trainsRaw);

            // Extract features and normalize
            trainsData = trainsJson.features.map(feature => {
                const props = feature.properties;
                return {
                    trainNumber: props.number,
                    trainName: props.name,
                    type: props.type || 'Express',
                    source: {
                        code: props.from_station_code,
                        name: props.from_station_name,
                        departureTime: props.departure_time
                    },
                    destination: {
                        code: props.to_station_code,
                        name: props.to_station_name,
                        arrivalTime: props.arrival_time
                    },
                    runningDays: props.running_days || [],
                    route: props.route || [],
                    isActive: true
                };
            });

            console.log(`Loaded ${trainsData.length} trains`);

            // Inject Custom Train: Kovai Express (12675)
            const customTrain = {
                trainNumber: "12675",
                trainName: "Kovai Express",
                type: "SF",
                source: {
                    code: "MAS",
                    name: "CHENNAI CENTRAL",
                    departureTime: "06:10:00"
                },
                destination: {
                    code: "CBE",
                    name: "COIMBATORE JN",
                    arrivalTime: "14:05:00"
                },
                runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                route: [
                    { code: "MAS", name: "CHENNAI CENTRAL", location: [80.27556, 13.08223] },
                    { code: "AJJ", name: "ARAKKONAM JN", location: [79.6676, 13.0844] },
                    { code: "KPD", name: "KATPADI JN", location: [79.1325, 12.9692] },
                    { code: "SA", name: "SALEM JN", location: [78.1460, 11.6643] },
                    { code: "ED", name: "ERODE JN", location: [77.7259, 11.3277] },
                    { code: "TUP", name: "TIRUPPUR", location: [77.3412, 11.1089] },
                    { code: "CBE", name: "COIMBATORE JN", location: [76.9663, 10.9976] }
                ],
                isActive: true,
                geometry: {
                    type: "LineString",
                    coordinates: [
                        [80.27556, 13.08223],
                        [79.6676, 13.0844],
                        [79.1325, 12.9692],
                        [78.1460, 11.6643],
                        [77.7259, 11.3277],
                        [77.3412, 11.1089],
                        [76.9663, 10.9976]
                    ]
                }
            };
            trainsData.push(customTrain);
            console.log('Injected custom train: Kovai Express (12675)');
        }

        if (fs.existsSync(stationsPath)) {
            const stationsRaw = fs.readFileSync(stationsPath, 'utf8');
            const stationsJson = JSON.parse(stationsRaw);

            stationsData = stationsJson.features.map(feature => {
                const props = feature.properties;
                const coords = feature.geometry?.coordinates || [0, 0];
                return {
                    code: props.code,
                    name: props.name,
                    state: props.state,
                    zone: props.zone,
                    address: props.address,
                    location: {
                        type: 'Point',
                        coordinates: coords
                    }
                };
            });

            console.log(`Loaded ${stationsData.length} stations`);
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
function searchTrains(query) {
    const lowerQuery = query.toLowerCase();
    return trainsData.filter(t =>
        t.trainNumber.toLowerCase().includes(lowerQuery) ||
        t.trainName.toLowerCase().includes(lowerQuery)
    );
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
