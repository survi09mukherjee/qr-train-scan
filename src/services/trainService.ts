import api from '../api/axios';

// Mock data for train details
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
    };
    nextTrain: {
        name: string;
        number: string;
        eta: string;
        status: string;
    };
}

export const fetchLiveTrainData = async (trainId: string): Promise<TrainData> => {
    try {
        const response = await api.get(`/trains/${trainId}`);

        if (response.data.success) {
            const data = response.data.data;

            // Derive current, previous, next from route and index
            const currentIndex = data.currentStationIndex || 0;
            const route = data.route || [];
            const currentStationObj = route[currentIndex] || {};
            const prevStationObj = route[currentIndex - 1] || null;
            const nextStationObj = route[currentIndex + 1] || null;

            // Helper to get coordinates
            const getCoords = (station: any) => {
                if (station && station.location && Array.isArray(station.location)) {
                    return { lat: station.location[1], lng: station.location[0] };
                }
                return { lat: 11.0168, lng: 76.9558 }; // Default
            };

            const currentCoords = getCoords(currentStationObj);

            return {
                trainName: data.trainName || "Unknown Train",
                trainNumber: data.trainNumber || trainId,
                pnr: data.pnrExample || "N/A",
                lat: currentCoords.lat,
                lng: currentCoords.lng,
                nearestStation: currentStationObj.name || "Unknown",
                etaFinalDestination: data.destination?.arrivalTime || "Unknown",
                speed: 0, // Not in static data
                timestamp: new Date().toISOString(),
                source: data.source?.name || "Unknown",
                destination: data.destination?.name || "Unknown",
                finalStop: data.destination?.name || "Unknown",
                previousStation: {
                    name: prevStationObj?.name || "Start",
                    departureTime: prevStationObj?.departureTime || "N/A",
                    lat: getCoords(prevStationObj).lat,
                    lng: getCoords(prevStationObj).lng
                },
                upcomingStation: {
                    name: nextStationObj?.name || "End",
                    distance: `${currentStationObj.distanceToNextKm || 0} km`,
                    eta: nextStationObj?.arrivalTime || "N/A",
                    lat: getCoords(nextStationObj).lat,
                    lng: getCoords(nextStationObj).lng
                },
                currentLocation: {
                    name: currentStationObj.name || "Unknown",
                    lat: currentCoords.lat,
                    lng: currentCoords.lng
                },
                weather: {
                    temp: 28, // Placeholder or parse from string
                    humidity: 60,
                    windSpeed: 10,
                    condition: (currentStationObj.weather as any) || "Sunny"
                },
                timezone: "IST (UTC+05:30)",
                nextMajorStops: data.nextStations || [],
                route: route.map((s: any) => ({
                    name: s.name,
                    code: s.code,
                    lat: getCoords(s).lat,
                    lng: getCoords(s).lng,
                    distance: `${s.distanceToNextKm || 0} km`,
                    weather: s.weather
                })),
                previousTrain: data.previousTrain || null,
                nextTrain: data.nextTrain || null
            };
        }

        throw new Error('Failed to fetch train data');
    } catch (error) {
        console.error("Error fetching train data:", error);
        throw error;
    }
};
