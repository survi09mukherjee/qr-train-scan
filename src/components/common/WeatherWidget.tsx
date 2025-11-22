import { Card, CardContent } from "@/components/ui/card";
import { CloudSun, Wind, Droplets, Clock } from "lucide-react";
import { useEffect, useState } from "react";

interface WeatherWidgetProps {
    lat: number;
    lng: number;
}

const WeatherWidget = ({ lat, lng }: WeatherWidgetProps) => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // Mock weather data based on lat/lng (in a real app, fetch from API)
    const temp = 28;
    const condition = "Partly Cloudy";
    const humidity = 65;
    const windSpeed = 12;

    return (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800">
            <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        <span className="font-mono text-lg font-medium">
                            {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                        {time.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })}
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <CloudSun className="h-12 w-12 text-orange-500" />
                        <div>
                            <div className="text-3xl font-bold">{temp}°C</div>
                            <div className="text-muted-foreground">{condition}</div>
                        </div>
                    </div>

                    <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <Droplets className="h-4 w-4" />
                            <span>{humidity}% Humidity</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Wind className="h-4 w-4" />
                            <span>{windSpeed} km/h Wind</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default WeatherWidget;
