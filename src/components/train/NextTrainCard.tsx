import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrainFront } from "lucide-react";

interface NextTrainCardProps {
    name: string;
    number: string;
    eta: string;
    status: string;
}

const NextTrainCard = ({ name, number, eta, status }: NextTrainCardProps) => {
    return (
        <Card className="shadow-lg hover:shadow-xl transition-shadow rounded-xl border-0 bg-white dark:bg-slate-800 h-full">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <TrainFront className="w-4 h-4 text-blue-500" />
                    Next Train
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-1">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white truncate" title={name}>{name}</h3>
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-medium bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded text-blue-700 dark:text-blue-300">#{number}</span>
                        <span className="text-xs font-bold text-orange-500">{status}</span>
                    </div>
                    <div className="text-xs text-slate-500 mt-2">
                        ETA: <span className="font-medium text-slate-900 dark:text-white">{eta}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default NextTrainCard;
