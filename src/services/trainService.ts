import trainsData from '../data/trains.json';
import stationsData from '../data/project_data.json';

export interface Station {
    name: string;
    code?: string;
    distance?: string;
    eta?: string;
    departureTime?: string;
    lat?: number;
    lng?: number;
    weather?: string;
}

export interface Weather {
    temp: number;
    humidity: number;
    windSpeed: number;
    condition: "Sunny" | "Cloudy" | "Rainy" | "Partly Cloudy";
}

export interface TrainData {
    trainName: string;
    trainNumber: string;
    pnr: string;
    lat: number;
    lng: number;
    nearestStation: string;
    etaFinalDestination: string;
    speed: number;
    timestamp: string;
    source: string;
    destination: string;
    finalStop: string;
    previousStation: Station;
    upcomingStation: Station;
    currentLocation: {
        name: string;
        lat: number;
        lng: number;
    };
    weather: Weather;
    timezone: string;
    nextMajorStops: string[];
    route: Station[];
    previousTrain: {
        name: string;
        number: string;
        departureTime: string;
        status: string;
    } | null;
    nextTrain: {
        name: string;
        number: string;
        eta: string;
        status: string;
    } | null;
}

// Helper to get station details from master DB
interface RawStation {
    code: string;
    name?: string;
    station_name?: string;
    latitude: number;
    longitude: number;
    weather_condition: string;
}

const getStationDetails = (code: string) => {
    const station = (stationsData as RawStation[]).find(s => s.code === code);
    return station ? {
        name: station.name || station.station_name || code,
        lat: station.latitude,
        lng: station.longitude,
        weather: station.weather_condition
    } : { name: code, lat: 11.0168, lng: 76.9558, weather: "Sunny" };
};

export const searchTrains = async (source: string, destination: string) => {
    const lowerSource = source.toLowerCase();
    const lowerDest = destination.toLowerCase();

    const results = trainsData.filter((t: any) => {
        const routeCodes = t.routeStations.map((c: string) => c.toLowerCase());

        // Simple check if source and dest exist in route
        // In a real app, we'd check names too, but for now codes are reliable in our data
        const sourceIndex = routeCodes.findIndex((c: string) => c === lowerSource || c.includes(lowerSource));
        const destIndex = routeCodes.findIndex((c: string) => c === lowerDest || c.includes(lowerDest));

        return sourceIndex !== -1 && destIndex !== -1 && sourceIndex < destIndex;
    }).map((t: any) => {
        const sourceStation = getStationDetails(t.source);
        const destStation = getStationDetails(t.destination);
        return {
            trainNumber: t.trainNumber,
            trainName: t.trainName,
            source: { name: sourceStation.name, departureTime: t.departureTime },
            destination: { name: destStation.name, arrivalTime: t.arrivalTime },
            duration: t.duration
        };
    });

    return { success: true, data: results };
};

export const getTrainByNumber = async (trainNumber: string) => {
    const train = trainsData.find((t: any) => t.trainNumber === trainNumber);

    if (train) {
        // Enrich train data
        const currentIndex = train.currentStationIndex || 0;
        const routeCodes = train.routeStations || [];

        // Build full route with details
        const fullRoute = routeCodes.map((code: string, index: number) => {
            const details = getStationDetails(code);
            const distance = train.segmentDistancesKm ? train.segmentDistancesKm[index] : 0;
            return {
                code,
                ...details,
                distance: `${distance} km`
            };
        });

        const currentStationObj = fullRoute[currentIndex];
        const prevStationObj = fullRoute[currentIndex - 1];
        const nextStationObj = fullRoute[currentIndex + 1];

        const enrichedData: TrainData = {
            trainName: train.trainName,
            trainNumber: train.trainNumber,
            pnr: train.pnrExample,
            lat: currentStationObj.lat,
            lng: currentStationObj.lng,
            nearestStation: currentStationObj.name,
            etaFinalDestination: train.arrivalTime, // Simplified
            speed: 0,
            timestamp: new Date().toISOString(),
            source: getStationDetails(train.source).name,
            destination: getStationDetails(train.destination).name,
            finalStop: getStationDetails(train.destination).name,
            previousStation: {
                name: prevStationObj?.name || "Start",
                departureTime: "N/A", // Would need schedule data per station
                lat: prevStationObj?.lat,
                lng: prevStationObj?.lng
            },
            upcomingStation: {
                name: nextStationObj?.name || "End",
                distance: nextStationObj?.distance || "0 km",
                eta: "N/A",
                lat: nextStationObj?.lat,
                lng: nextStationObj?.lng
            },
            currentLocation: {
                name: currentStationObj.name,
                lat: currentStationObj.lat,
                lng: currentStationObj.lng
            },
            weather: {
                temp: 28,
                humidity: 60,
                windSpeed: 10,
                condition: (currentStationObj.weather as any) || "Sunny"
            },
            timezone: "IST (UTC+05:30)",
            nextMajorStops: routeCodes.slice(currentIndex + 1),
            route: fullRoute,
            previousTrain: null, // Mock data removed for simplicity or can be re-added
            nextTrain: null
        };

        return { success: true, data: enrichedData };
    }

    return { success: false, error: "Train not found" };
};

export const decodeQR = async (qrString: string) => {
    // Simple logic: assume QR contains train number
    const trainNumberMatch = qrString.match(/\b\d{5}\b/);
    if (trainNumberMatch) {
        return getTrainByNumber(trainNumberMatch[0]);
    }
    return { success: false, error: "Invalid QR Code" };
};

// Keep fetchLiveTrainData for compatibility but redirect to getTrainByNumber
export const fetchLiveTrainData = async (trainId: string): Promise<TrainData> => {
    const response = await getTrainByNumber(trainId);
    if (response.success && response.data) {
        return response.data;
    }
    throw new Error(response.error || "Failed to fetch train data");
};
