import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { History } from "lucide-react";

interface PreviousStationCardProps {
    name: string;
    departureTime?: string;
}

const PreviousStationCard = ({ name, departureTime }: PreviousStationCardProps) => {
    return (
        <Card className="shadow-lg hover:shadow-xl transition-shadow rounded-xl border-0 bg-white dark:bg-slate-800">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <History className="w-4 h-4 text-orange-500" />
                    Previous Station
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white truncate">{name}</h3>
                    <div className="text-sm text-slate-500">
                        Departed at: <span className="font-medium text-slate-900 dark:text-white">{departureTime || '--'}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default PreviousStationCard;
