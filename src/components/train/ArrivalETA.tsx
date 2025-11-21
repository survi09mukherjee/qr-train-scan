import { Card, CardContent } from "@/components/ui/card";
import { Clock, MapPin, Gauge } from "lucide-react";

interface ArrivalETAProps {
    eta: string;
    nearestStation: string;
    speed: number;
}

const ArrivalETA = ({ eta, nearestStation, speed }: ArrivalETAProps) => {
    return (
        <div className="grid gap-4 md:grid-cols-3">
            <Card>
                <CardContent className="flex flex-col items-center justify-center p-6 text-center space-y-2">
                    <Clock className="h-8 w-8 text-blue-500 mb-2" />
                    <div className="text-sm font-medium text-muted-foreground">ETA Destination</div>
                    <div className="text-2xl font-bold">{eta}</div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="flex flex-col items-center justify-center p-6 text-center space-y-2">
                    <MapPin className="h-8 w-8 text-green-500 mb-2" />
                    <div className="text-sm font-medium text-muted-foreground">Nearest Station</div>
                    <div className="text-xl font-bold truncate w-full">{nearestStation}</div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="flex flex-col items-center justify-center p-6 text-center space-y-2">
                    <Gauge className="h-8 w-8 text-orange-500 mb-2" />
                    <div className="text-sm font-medium text-muted-foreground">Current Speed</div>
                    <div className="text-2xl font-bold">{speed} km/h</div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ArrivalETA;
