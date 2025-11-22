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
        <Card className="shadow-lg hover:shadow-xl transition-shadow rounded-xl border-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800 h-full">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <CloudSun className="w-4 h-4 text-orange-500" />
                    Weather Conditions
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-2">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <CloudSun className="h-12 w-12 text-orange-500" />
                        <div>
                            <div className="text-3xl font-bold text-slate-900 dark:text-white">{temp}°C</div>
                            <div className="text-muted-foreground font-medium">{condition}</div>
                        </div>
                    </div>

                    <div className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                        <div className="flex items-center gap-2">
                            <Droplets className="h-4 w-4 text-blue-500" />
                            <span>{humidity}% Humidity</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Wind className="h-4 w-4 text-slate-500" />
                            <span>{windSpeed} km/h Wind</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default WeatherWidget;
