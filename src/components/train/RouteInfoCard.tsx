import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Route } from "lucide-react";

interface RouteInfoCardProps {
    source: string;
    destination: string;
    nextStops: string[];
}

const RouteInfoCard = ({ source, destination, nextStops }: RouteInfoCardProps) => {
    return (
        <Card className="shadow-lg hover:shadow-xl transition-shadow rounded-xl border-0 bg-white dark:bg-slate-800 h-full">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <Route className="w-4 h-4 text-purple-500" />
                    Route Information
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between relative">
                    {/* Connecting Line */}
                    <div className="absolute left-[5px] top-2 bottom-2 w-0.5 bg-slate-200 dark:bg-slate-700" />

                    <div className="space-y-6 w-full">
                        <div className="flex gap-3 relative">
                            <div className="w-3 h-3 rounded-full bg-green-500 ring-4 ring-white dark:ring-slate-800 z-10 mt-1.5" />
                            <div>
                                <div className="text-xs text-slate-500">Source</div>
                                <div className="font-semibold text-slate-900 dark:text-white">{source}</div>
                            </div>
                        </div>

                        <div className="flex gap-3 relative">
                            <div className="w-3 h-3 rounded-full bg-blue-500 ring-4 ring-white dark:ring-slate-800 z-10 mt-1.5" />
                            <div>
                                <div className="text-xs text-slate-500">Next Major Stops</div>
                                <div className="font-medium text-slate-900 dark:text-white text-sm">
                                    {nextStops.join(", ")}
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 relative">
                            <div className="w-3 h-3 rounded-full bg-red-500 ring-4 ring-white dark:ring-slate-800 z-10 mt-1.5" />
                            <div>
                                <div className="text-xs text-slate-500">Destination</div>
                                <div className="font-semibold text-slate-900 dark:text-white">{destination}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default RouteInfoCard;
