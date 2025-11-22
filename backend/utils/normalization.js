const mongoose = require('mongoose');

const normalizeStation = (feature) => {
    const props = feature.properties;
    const geometry = feature.geometry;

    return {
        code: props.code,
        name: props.name,
        state: props.state,
        zone: props.zone,
        location: {
            type: 'Point',
            coordinates: geometry ? geometry.coordinates : [0, 0]
        }
    };
};

const normalizeTrain = (feature, stationMap) => {
    const props = feature.properties;
    const geometry = feature.geometry;

    // Try to infer running days if not present (default to Daily if unknown)
    // The provided JSON might not have 'days', so we'll leave it empty or default.
    const runningDays = props.days ? props.days : []; // Assuming 'days' might exist or be parsed from 'classes' if it encoded days

    const sourceCode = props.from_station_code;
    const destCode = props.to_station_code;

    const sourceStation = stationMap[sourceCode];
    const destStation = stationMap[destCode];

    return {
        trainNumber: props.number,
        trainName: props.name,
        type: props.type,
        source: {
            code: sourceCode,
            name: props.from_station_name,
            departureTime: props.departure
        },
        destination: {
            code: destCode,
            name: props.to_station_name,
            arrivalTime: props.arrival
        },
        runningDays: runningDays,
        // We will populate route later or leave it as just source/dest for now
        // If we wanted to infer route from geometry, it would be a separate heavy process
        route: [
            {
                stationCode: sourceCode,
                stationName: props.from_station_name,
                departureTime: props.departure,
                distance: 0,
                day: 1
            },
            {
                stationCode: destCode,
                stationName: props.to_station_name,
                arrivalTime: props.arrival,
                distance: props.distance,
                day: props.duration_h > 24 ? 2 : 1 // Rough estimate
            }
        ],
        isActive: true,
        lastUpdated: new Date()
    };
};

module.exports = {
    normalizeStation,
    normalizeTrain
};
