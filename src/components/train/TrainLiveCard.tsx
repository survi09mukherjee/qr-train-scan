import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrainFront } from "lucide-react";

interface TrainLiveCardProps {
    trainName: string;
    trainNumber: string;
    pnr: string;
}

const TrainLiveCard = ({ trainName, trainNumber, pnr }: TrainLiveCardProps) => {
    return (
        <Card className="w-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                    Train Identity
                </CardTitle>
                <TrainFront className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="flex flex-col space-y-1">
                    <div className="text-2xl font-bold">{trainName}</div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-xs font-medium">
                            #{trainNumber}
                        </span>
                        <span>PNR: {pnr}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default TrainLiveCard;
