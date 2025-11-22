import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";

interface CurrentLocationCardProps {
    name: string;
    lat: number;
    lng: number;
}

const CurrentLocationCard = ({ name, lat, lng }: CurrentLocationCardProps) => {
    return (
        <Card className="shadow-lg hover:shadow-xl transition-shadow rounded-xl border-0 bg-white dark:bg-slate-800">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-500" />
                    Current Location
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-1">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">{name}</h3>
                    <p className="text-xs text-slate-500 font-mono">
                        {lat.toFixed(4)}° N, {lng.toFixed(4)}° E
                    </p>
                </div>
            </CardContent>
        </Card>
    );
};

export default CurrentLocationCard;
