import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CloudSun, Wind, Droplets } from "lucide-react";

interface WeatherWidgetProps {
    lat: number;
    lng: number;
    weather: {
        temp: number;
        humidity: number;
        windSpeed: number;
        condition: "Sunny" | "Cloudy" | "Rainy" | "Partly Cloudy";
    };
}

const WeatherWidget = ({ lat, lng, weather }: WeatherWidgetProps) => {
    const { temp, humidity, windSpeed, condition } = weather;

    return (
        <Card className="shadow-md hover:shadow-lg transition-shadow rounded-xl border-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800 h-full">
            <CardHeader className="pb-1 pt-3 px-4">
                <CardTitle className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <CloudSun className="w-3.5 h-3.5 text-orange-500" />
                    Weather
                </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <CloudSun className="h-8 w-8 text-orange-500" />
                        <div>
                            <div className="text-2xl font-bold text-slate-900 dark:text-white">{temp}°C</div>
                            <div className="text-xs text-muted-foreground font-medium">{condition}</div>
                        </div>
                    </div>

                    <div className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
                        <div className="flex items-center gap-1.5">
                            <Droplets className="h-3 w-3 text-blue-500" />
                            <span>{humidity}%</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Wind className="h-3 w-3 text-slate-500" />
                            <span>{windSpeed} km/h</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default WeatherWidget;
