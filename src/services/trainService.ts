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
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const now = new Date();
    const randomOffset = () => (Math.random() - 0.5) * 0.001;

    // Mock data database
    const trains: Record<string, any> = {
        "12345": {
            trainName: "Howrah Superfast Express",
            trainNumber: "12841",
            pnr: "6319248756",
            baseLat: 22.5726,
            baseLng: 88.3639,
            nearestStation: "Howrah Junction",
            etaFinalDestination: "02:17:00",
            source: "Chennai Central",
            destination: "Howrah Junction",
            finalStop: "Howrah Junction",
            previousStation: { name: "Kharagpur Jn", departureTime: "12:45 PM" },
            upcomingStation: { name: "Santragachi Jn", distance: "15 km", eta: "01:55 PM" },
            currentLocation: { name: "Near Uluberia", lat: 22.47, lng: 88.10 },
            weather: { temp: 29, humidity: 72, windSpeed: 15, condition: "Partly Cloudy" },
            timezone: "IST (UTC+05:30)",
            nextMajorStops: ["Santragachi Jn", "Howrah Junction"]
        },
        "67890": {
            trainName: "Rajdhani Express",
            trainNumber: "12951",
            pnr: "8234567890",
            baseLat: 19.0760,
            baseLng: 72.8777,
            nearestStation: "Mumbai Central",
            etaFinalDestination: "08:30:00",
            source: "New Delhi",
            destination: "Mumbai Central",
            finalStop: "Mumbai Central",
            previousStation: { name: "Borivali", departureTime: "07:55 AM" },
            upcomingStation: { name: "Mumbai Central", distance: "5 km", eta: "08:30 AM" },
            currentLocation: { name: "Approaching Dadar", lat: 19.02, lng: 72.84 },
            weather: { temp: 26, humidity: 65, windSpeed: 10, condition: "Sunny" },
            timezone: "IST (UTC+05:30)",
            nextMajorStops: ["Mumbai Central"]
        },
        "11223": {
            trainName: "Vande Bharat Express",
            trainNumber: "20608",
            pnr: "4567890123",
            baseLat: 13.0827,
            baseLng: 80.2707,
            nearestStation: "Chennai Central",
            etaFinalDestination: "19:15:00",
            source: "Mysuru Jn",
            destination: "Chennai Central",
            finalStop: "Chennai Central",
            previousStation: { name: "Katpadi Jn", departureTime: "05:45 PM" },
            upcomingStation: { name: "Perambur", distance: "8 km", eta: "07:05 PM" },
            currentLocation: { name: "Avadi", lat: 13.11, lng: 80.10 },
            weather: { temp: 30, humidity: 60, windSpeed: 18, condition: "Cloudy" },
            timezone: "IST (UTC+05:30)",
            nextMajorStops: ["Chennai Central"]
        }
    };

    const train = trains[trainId] || trains["12345"]; // Fallback to default if ID not found

    return {
        trainName: train.trainName,
        trainNumber: train.trainNumber,
        pnr: train.pnr,
        lat: train.baseLat + randomOffset(),
        lng: train.baseLng + randomOffset(),
        nearestStation: train.nearestStation,
        etaFinalDestination: train.etaFinalDestination,
        speed: 65 + Math.floor(Math.random() * 50),
        timestamp: now.toISOString(),
        source: train.source,
        destination: train.destination,
        finalStop: train.finalStop,
        previousStation: train.previousStation,
        upcomingStation: train.upcomingStation,
        currentLocation: {
            ...train.currentLocation,
            lat: train.baseLat + randomOffset(),
            lng: train.baseLng + randomOffset()
        },
        weather: train.weather,
        timezone: train.timezone,
        nextMajorStops: train.nextMajorStops
    };
};
