import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Train, MapPin, Circle } from "lucide-react";

interface RailTrackProps {
    source: string;
    destination: string;
    currentStation: string;
    nextStation: string;
    progress: number; // 0 to 100
}

const RailTrack = ({ source, destination, currentStation, nextStation, progress }: RailTrackProps) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">Live Track Status</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="relative py-8 px-4">
                    {/* Track Line */}
                    <div className="absolute top-1/2 left-0 w-full h-2 bg-secondary -translate-y-1/2 rounded-full" />

                    {/* Progress Line */}
                    <div
                        className="absolute top-1/2 left-0 h-2 bg-primary -translate-y-1/2 rounded-full transition-all duration-1000 ease-in-out"
                        style={{ width: `${progress}%` }}
                    />

                    {/* Stations */}
                    <div className="relative flex justify-between items-center">
                        {/* Source */}
                        <div className="flex flex-col items-center gap-2 -mt-1">
                            <div className="w-4 h-4 rounded-full bg-primary ring-4 ring-background" />
                            <div className="text-xs font-medium text-center max-w-[80px]">{source}</div>
                        </div>

                        {/* Train Icon (Moving) */}
                        <div
                            className="absolute top-1/2 -translate-y-1/2 z-10 transition-all duration-1000 ease-in-out"
                            style={{ left: `${progress}%`, transform: 'translate(-50%, -50%)' }}
                        >
                            <div className="bg-primary text-primary-foreground p-2 rounded-full shadow-lg">
                                <Train className="h-5 w-5" />
                            </div>
                            <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-popover text-popover-foreground text-xs px-2 py-1 rounded shadow border">
                                Moving to {nextStation}
                            </div>
                        </div>

                        {/* Destination */}
                        <div className="flex flex-col items-center gap-2 -mt-1">
                            <div className="w-4 h-4 rounded-full bg-secondary ring-4 ring-background border-2 border-primary" />
                            <div className="text-xs font-medium text-center max-w-[80px]">{destination}</div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default RailTrack;
