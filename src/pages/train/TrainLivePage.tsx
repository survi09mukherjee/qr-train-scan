import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchLiveTrainData, TrainData } from "@/services/trainService";
import TrainLiveCard from "@/components/train/TrainLiveCard";
import TrainMap from "@/components/train/TrainMap";
import ArrivalETA from "@/components/train/ArrivalETA";
import RailTrack from "@/components/train/RailTrack";
import WeatherWidget from "@/components/common/WeatherWidget";
import Loader from "@/components/common/Loader";
import ErrorState from "@/components/common/ErrorState";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

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

        const interval = setInterval(() => {
            loadData(true);
        }, 5000);

        return () => clearInterval(interval);
    }, [trainId]);

    if (loading && !data) return <Loader text="Fetching live train status..." />;
    if (error) return <ErrorState onRetry={() => loadData()} />;
    if (!data) return <ErrorState title="Train Not Found" message="We couldn't find details for this train." />;

    return (
        <div className="space-y-6 max-w-4xl mx-auto pb-10">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate("/scan")}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <h1 className="text-2xl font-bold">Live Tracking</h1>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <div className="md:col-span-2 space-y-6">
                    <TrainLiveCard
                        trainName={data.trainName}
                        trainNumber={data.trainNumber}
                        pnr={data.pnr}
                    />

                    <RailTrack
                        source={data.source}
                        destination={data.destination}
                        currentStation={data.nearestStation}
                        nextStation={data.finalStop} // Using final stop as next major point for demo
                        progress={65} // Mock progress
                    />

                    <TrainMap
                        lat={data.lat}
                        lng={data.lng}
                        trainName={data.trainName}
                    />
                </div>

                <div className="space-y-6">
                    <WeatherWidget lat={data.lat} lng={data.lng} />

                    <ArrivalETA
                        eta={data.etaFinalDestination}
                        nearestStation={data.nearestStation}
                        speed={data.speed}
                    />

                    <div className="bg-card rounded-lg border p-4 space-y-3">
                        <h3 className="font-semibold text-sm text-muted-foreground">Route Info</h3>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">Source</span>
                            <span className="font-medium">{data.source}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">Destination</span>
                            <span className="font-medium">{data.destination}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">Final Stop</span>
                            <span className="font-medium">{data.finalStop}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrainLivePage;
