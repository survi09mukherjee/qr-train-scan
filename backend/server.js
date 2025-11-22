const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// --- Data Loading ---
const trainsPath = path.join(__dirname, 'data', 'trains.json');
const stationsPath = path.join(__dirname, 'data', 'stations.json');

let trainsData = null;
let stationsData = null;
let stationMap = {};

function loadData() {
    try {
        console.log("Loading data files...");
        if (fs.existsSync(trainsPath)) {
            const trainsRaw = fs.readFileSync(trainsPath, 'utf8');
            trainsData = JSON.parse(trainsRaw);
            console.log(`Loaded ${trainsData.features.length} trains.`);
        } else {
            console.error("trains.json not found!");
        }

        if (fs.existsSync(stationsPath)) {
            const stationsRaw = fs.readFileSync(stationsPath, 'utf8');
            stationsData = JSON.parse(stationsRaw);
            
            // Build station map for quick lookup
            stationsData.features.forEach(feature => {
                if (feature.properties && feature.properties.code) {
                    // Store coordinates as [lat, lng] for easier frontend use if needed, 
                    // but GeoJSON is [lng, lat]. Let's keep GeoJSON format [lng, lat].
                    stationMap[feature.properties.code] = {
                        name: feature.properties.name,
                        coordinates: feature.geometry ? feature.geometry.coordinates : null,
                        state: feature.properties.state
                    };
                }
            });
            console.log(`Loaded ${Object.keys(stationMap).length} stations.`);
        } else {
            console.error("stations.json not found!");
        }
    } catch (err) {
        console.error("Error loading data:", err);
    }
}

loadData();

// --- Helper Functions ---

// Simple cache for live status to avoid hitting external sites too often
const liveStatusCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

async function scrapeLiveStatus(trainNumber) {
    // Check cache first
    if (liveStatusCache.has(trainNumber)) {
        const cached = liveStatusCache.get(trainNumber);
        if (Date.now() - cached.timestamp < CACHE_DURATION) {
            return cached.data;
        }
    }

    // TODO: Implement actual scraping. 
    // For now, return a simulated "Live" status based on schedule or random delay
    // to ensure the frontend has something to show.
    
    // Mock logic for demonstration until scraping is robust
    const delay = Math.floor(Math.random() * 15); // 0-15 mins delay
    const status = delay > 0 ? "Delayed" : "On Time";
    
    const liveData = {
        current_station: "Simulated Station",
        delay: `${delay} min`,
        status: status,
        last_updated: new Date().toISOString(),
        message: "Real-time scraping pending implementation"
    };

    liveStatusCache.set(trainNumber, {
        timestamp: Date.now(),
        data: liveData
    });

    return liveData;
}

// --- Endpoints ---

app.get('/api/trains/:trainId', async (req, res) => {
    const { trainId } = req.params; // This is expected to be the Train Number (e.g., "12631")
    
    console.log(`Fetching details for train: ${trainId}`);

    if (!trainsData) {
        return res.status(503).json({ error: "Server data not loaded yet" });
    }

    // 1. Find train in static database
    // trains.json structure: feature.properties.number is the train number (string)
    const trainFeature = trainsData.features.find(f => f.properties.number === trainId);

    if (!trainFeature) {
        console.log("Train not found in static DB");
        // Try to find by name if number fails (optional, but good for robustness)
        // For now, just return 404
        return res.status(404).json({ 
            error: "Train not found", 
            message: `Could not find train number ${trainId} in our database.` 
        });
    }

    const props = trainFeature.properties;
    
    // 2. Get Station Details
    const sourceStation = stationMap[props.from_station_code] || {};
    const destStation = stationMap[props.to_station_code] || {};

    // 3. Get Live Status
    let liveStatus = {};
    try {
        liveStatus = await scrapeLiveStatus(trainId);
    } catch (error) {
        console.error("Failed to get live status:", error);
        liveStatus = { status: "Unknown", error: "Could not fetch live status" };
    }

    // 4. Construct Response
    const responseData = {
        train_number: props.number,
        train_name: props.name,
        type: props.type,
        zone: props.zone,
        schedule: {
            departure: props.departure,
            arrival: props.arrival,
            duration: `${props.duration_h}h ${props.duration_m}m`,
            days: props.classes // Sometimes contains running days info
        },
        route: {
            from: {
                code: props.from_station_code,
                name: props.from_station_name,
                coordinates: sourceStation.coordinates // [lng, lat]
            },
            to: {
                code: props.to_station_code,
                name: props.to_station_name,
                coordinates: destStation.coordinates // [lng, lat]
            },
            geometry: trainFeature.geometry // Full LineString of the route
        },
        live_status: liveStatus
    };

    res.json(responseData);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
