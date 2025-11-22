import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRightCircle } from "lucide-react";

interface UpcomingStationCardProps {
    name: string;
    distance?: string;
    eta?: string;
}

const UpcomingStationCard = ({ name, distance, eta }: UpcomingStationCardProps) => {
    return (
        <Card className="shadow-lg hover:shadow-xl transition-shadow rounded-xl border-0 bg-white dark:bg-slate-800">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <ArrowRightCircle className="w-4 h-4 text-green-500" />
                    Upcoming Station
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white truncate">{name}</h3>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-500">Distance: <span className="font-medium text-slate-900 dark:text-white">{distance || '--'}</span></span>
                        <span className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2 py-1 rounded-md font-medium text-xs">
                            ETA: {eta || '--'}
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default UpcomingStationCard;
