const fs = require('fs');
const path = require('path');
const Train = require('../models/Train');
const Station = require('../models/Station');
const { normalizeStation, normalizeTrain } = require('../utils/normalization');

const trainsPath = path.join(__dirname, '../data/trains.json');
const stationsPath = path.join(__dirname, '../data/stations.json');

const ingestData = async () => {
    try {
        console.log('Starting data ingestion...');

        // 1. Load Stations
        if (fs.existsSync(stationsPath)) {
            console.log('Reading stations.json...');
            const stationsRaw = fs.readFileSync(stationsPath, 'utf8');
            const stationsData = JSON.parse(stationsRaw);

            console.log(`Found ${stationsData.features.length} stations. Processing...`);

            const stationOps = stationsData.features.map(feature => {
                if (!feature.properties.code) return null;
                const normalized = normalizeStation(feature);
                return {
                    updateOne: {
                        filter: { code: normalized.code },
                        update: { $set: normalized },
                        upsert: true
                    }
                };
            }).filter(op => op !== null);

            if (stationOps.length > 0) {
                await Station.bulkWrite(stationOps);
                console.log(`Upserted ${stationOps.length} stations.`);
            }
        } else {
            console.warn('stations.json not found. Skipping station ingestion.');
        }

        // 2. Build Station Map for Train Normalization
        const stations = await Station.find().lean();
        const stationMap = {};
        stations.forEach(s => {
            stationMap[s.code] = s;
        });

        // 3. Load Trains
        if (fs.existsSync(trainsPath)) {
            console.log('Reading trains.json...');
            const trainsRaw = fs.readFileSync(trainsPath, 'utf8');
            const trainsData = JSON.parse(trainsRaw);

            console.log(`Found ${trainsData.features.length} trains. Processing...`);

            const trainOps = trainsData.features.map(feature => {
                if (!feature.properties.number) return null;
                const normalized = normalizeTrain(feature, stationMap);
                return {
                    updateOne: {
                        filter: { trainNumber: normalized.trainNumber },
                        update: { $set: normalized },
                        upsert: true
                    }
                };
            }).filter(op => op !== null);

            // Process in chunks to avoid memory issues
            const CHUNK_SIZE = 500;
            for (let i = 0; i < trainOps.length; i += CHUNK_SIZE) {
                const chunk = trainOps.slice(i, i + CHUNK_SIZE);
                await Train.bulkWrite(chunk);
                console.log(`Processed trains chunk ${i} to ${i + chunk.length}`);
            }

            console.log('Train ingestion complete.');
        } else {
            console.warn('trains.json not found. Skipping train ingestion.');
        }

        console.log('Data ingestion finished successfully.');
    } catch (error) {
        console.error('Error during ingestion:', error);
    }
};

module.exports = {
    ingestData
};
