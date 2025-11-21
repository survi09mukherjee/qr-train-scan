// Mock data for train details
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
}

export const fetchLiveTrainData = async (trainId: string): Promise<TrainData> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Mock response based on trainId (for demo purposes, returning same data)
    // In a real app, this would fetch from /api/train/:trainId/live
    const now = new Date();

    // Simulate moving train (just wiggling the coordinates slightly)
    const baseLat = 22.5726;
    const baseLng = 88.3639;
    const randomOffset = () => (Math.random() - 0.5) * 0.001;

    return {
        trainName: "Howrah Superfast Express",
        trainNumber: "12841",
        pnr: "6319248756",
        lat: baseLat + randomOffset(),
        lng: baseLng + randomOffset(),
        nearestStation: "Howrah Junction",
        etaFinalDestination: "02:17:00",
        speed: 65 + Math.floor(Math.random() * 5), // Random speed between 65-70
        timestamp: now.toISOString(),
    };
};
