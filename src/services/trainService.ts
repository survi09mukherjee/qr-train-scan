// Mock data for train details
export interface Station {
    name: string;
    distance?: string;
    eta?: string;
    departureTime?: string;
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
}

export const fetchLiveTrainData = async (trainId: string): Promise<TrainData> => {
    try {
        const response = await fetch(`/api/trains/${trainId}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();

        // Ensure we return the expected structure
        return {
            trainName: data.trainName || "Unknown Train",
            trainNumber: data.trainNumber || trainId,
            pnr: data.pnr || "N/A",
            lat: data.lat || 11.0168,
            lng: data.lng || 76.9558,
            nearestStation: data.nearestStation || "Coimbatore Jn",
            etaFinalDestination: data.etaFinalDestination || "Unknown",
            speed: data.speed || 0,
            timestamp: data.timestamp || new Date().toISOString(),
            source: data.source || "Unknown",
            destination: data.destination || "Unknown",
            finalStop: data.destination || "Unknown",
            previousStation: data.previousStation || { name: "Unknown", departureTime: "N/A" },
            upcomingStation: data.upcomingStation || { name: "Unknown", distance: "0 km", eta: "N/A" },
            currentLocation: data.currentLocation || { name: "Unknown", lat: 11.0168, lng: 76.9558 },
            weather: data.weather || { temp: 28, humidity: 60, windSpeed: 10, condition: "Sunny" },
            timezone: data.timezone || "IST (UTC+05:30)",
            nextMajorStops: data.nextMajorStops || []
        };
    } catch (error) {
        console.error("Error fetching train data:", error);
        // Fallback to mock data if API fails (for robustness during dev)
        return {
            trainName: "Connection Error",
            trainNumber: trainId,
            pnr: "N/A",
            lat: 11.0168,
            lng: 76.9558,
            nearestStation: "Coimbatore Jn",
            etaFinalDestination: "N/A",
            speed: 0,
            timestamp: new Date().toISOString(),
            source: "N/A",
            destination: "N/A",
            finalStop: "N/A",
            previousStation: { name: "N/A", departureTime: "N/A" },
            upcomingStation: { name: "N/A", distance: "N/A", eta: "N/A" },
            currentLocation: { name: "N/A", lat: 11.0168, lng: 76.9558 },
            weather: { temp: 0, humidity: 0, windSpeed: 0, condition: "Sunny" },
            timezone: "IST",
            nextMajorStops: []
        };
    }
};
