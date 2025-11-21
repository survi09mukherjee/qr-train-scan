import { useState, useEffect } from "react";
import { WifiOff } from "lucide-react";

const NetworkStatus = () => {
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);

        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
        };
    }, []);

    if (isOnline) return null;

    return (
        <div className="fixed bottom-4 right-4 z-50 bg-destructive text-destructive-foreground px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-in slide-in-from-bottom-5">
            <WifiOff className="h-5 w-5" />
            <div>
                <p className="font-medium">No Internet Connection</p>
                <p className="text-xs opacity-90">Please check your network settings.</p>
            </div>
        </div>
    );
};

export default NetworkStatus;
