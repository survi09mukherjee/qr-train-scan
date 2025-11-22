import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { useEffect, useState } from "react";

interface TimeCardProps {
    timezone: string;
}

const TimeCard = ({ timezone }: TimeCardProps) => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <Card className="shadow-lg hover:shadow-xl transition-shadow rounded-xl border-0 bg-gradient-to-br from-slate-800 to-slate-900 text-white">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-400" />
                    Current Time
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-1">
                    <div className="text-3xl font-mono font-bold tracking-wider">
                        {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </div>
                    <div className="text-xs text-slate-400">
                        {timezone}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default TimeCard;
