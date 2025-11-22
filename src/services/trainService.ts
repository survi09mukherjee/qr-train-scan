import api from '../api/axios';

// Mock data for train details
export interface Station {
    name: string;
    distance?: string;
    eta?: string;
    departureTime?: string;
    lat?: number;
    lng?: number;
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
        const response = await api.get(`/trains/${trainId}/live`);

        if (response.data.success) {
            const data = response.data.data;
            return {
                trainName: data.trainName || "Unknown Train",
                trainNumber: data.trainNumber || trainId,
                pnr: data.pnr || "N/A",
                lat: data.lat || 11.0168,
                lng: data.lng || 76.9558,
                nearestStation: data.nearestStation || "Unknown",
                etaFinalDestination: data.etaFinalDestination || "Unknown",
                speed: data.speed || 0,
                timestamp: data.timestamp || new Date().toISOString(),
                source: data.source || "Unknown",
                destination: data.destination || "Unknown",
                finalStop: data.finalStop || data.destination || "Unknown",
                previousStation: data.previousStation || { name: "Unknown", departureTime: "N/A" },
                upcomingStation: data.upcomingStation || { name: "Unknown", distance: "0 km", eta: "N/A" },
                currentLocation: data.currentLocation || { name: "Unknown", lat: 11.0168, lng: 76.9558 },
                weather: data.weather || { temp: 28, humidity: 60, windSpeed: 10, condition: "Sunny" },
                timezone: data.timezone || "IST (UTC+05:30)",
                nextMajorStops: data.nextMajorStops || [],
                route: data.route || [],
                previousTrain: data.previousTrain || {
                    name: "Shatabdi Express",
                    number: "12007",
                    departureTime: "10:15 AM",
                    status: "Departed"
                },
                nextTrain: data.nextTrain || {
                    name: "Lalbagh Express",
                    number: "12607",
                    eta: "02:30 PM",
                    status: "On Time"
                }
            };
        }

        throw new Error('Failed to fetch train data');
    } catch (error) {
        console.error("Error fetching train data:", error);
        throw error;
    }
};
