const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const liveStatusCache = new Map();

const getLiveStatus = async (trainNumber) => {
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
};

module.exports = {
    getLiveStatus
};
