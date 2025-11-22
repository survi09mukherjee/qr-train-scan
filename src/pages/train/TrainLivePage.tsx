import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchLiveTrainData, TrainData } from "@/services/trainService";
import TrainMap from "@/components/train/TrainMap";
import Loader from "@/components/common/Loader";
import ErrorState from "@/components/common/ErrorState";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Share2, RefreshCw } from "lucide-react";
import CurrentLocationCard from "@/components/train/CurrentLocationCard";
import UpcomingStationCard from "@/components/train/UpcomingStationCard";
import PreviousStationCard from "@/components/train/PreviousStationCard";
import TimeCard from "@/components/train/TimeCard";
import RouteInfoCard from "@/components/train/RouteInfoCard";
import WeatherWidget from "@/components/common/WeatherWidget";

const TrainLivePage = () => {
    const { trainId } = useParams<{ trainId: string }>();
    const navigate = useNavigate();
    const [data, setData] = useState<TrainData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const loadData = async (isRefresh = false) => {
        if (!trainId) return;
        if (!isRefresh) setLoading(true);
        try {
            const result = await fetchLiveTrainData(trainId);
            setData(result);
            setError(false);
        } catch (err) {
            console.error(err);
            setError(true);
        } finally {
            if (!isRefresh) setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
        const interval = setInterval(() => loadData(true), 5000);
        return () => clearInterval(interval);
    }, [trainId]);

    if (loading && !data) return <Loader text="Fetching live train status..." />;
    if (error) return <ErrorState onRetry={() => loadData()} />;
    if (!data) return <ErrorState title="Train Not Found" message="We couldn't find details for this train." />;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-12">
            {/* Sticky Header */}
            <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={() => navigate("/")} className="rounded-full">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <div>
                            <h1 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                                {data.trainName}
                            </h1>
                            <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                                <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded">#{data.trainNumber}</span>
                                <span>PNR: {data.pnr}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="icon" onClick={() => loadData(true)} className="rounded-full">
                            <RefreshCw className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="rounded-full">
                            <Share2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
                {/* Top Grid: Map & Primary Info */}
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Map Section - Takes 2 columns on large screens */}
                    <div className="lg:col-span-2 h-[400px] lg:h-[500px] rounded-2xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-800 relative z-0">
                        <TrainMap
                            lat={data.lat}
                            lng={data.lng}
                            trainName={data.trainName}
                        />
                    </div>

                    {/* Right Side Cards */}
                    <div className="space-y-4 flex flex-col">
                        <TimeCard timezone={data.timezone} />
                        <CurrentLocationCard
                            name={data.currentLocation.name}
                            lat={data.currentLocation.lat}
                            lng={data.currentLocation.lng}
                        />
                        <WeatherWidget
                            lat={data.lat}
                            lng={data.lng}
                            weather={data.weather}
                        />
                    </div>
                </div>

                {/* Bottom Grid: Station Info & Route */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <PreviousStationCard
                        name={data.previousStation.name}
                        departureTime={data.previousStation.departureTime}
                    />
                    <UpcomingStationCard
                        name={data.upcomingStation.name}
                        distance={data.upcomingStation.distance}
                        eta={data.upcomingStation.eta}
                    />
                    <div className="md:col-span-2 lg:col-span-1">
                        <RouteInfoCard
                            source={data.source}
                            destination={data.destination}
                            nextStops={data.nextMajorStops}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrainLivePage;
