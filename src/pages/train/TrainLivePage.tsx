import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchLiveTrainData, TrainData } from "@/services/trainService";
import TrainLiveCard from "@/components/train/TrainLiveCard";
import TrainMap from "@/components/train/TrainMap";
import ArrivalETA from "@/components/train/ArrivalETA";
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

            <TrainLiveCard
                trainName={data.trainName}
                trainNumber={data.trainNumber}
                pnr={data.pnr}
            />

            <TrainMap
                lat={data.lat}
                lng={data.lng}
                trainName={data.trainName}
            />

            <ArrivalETA
                eta={data.etaFinalDestination}
                nearestStation={data.nearestStation}
                speed={data.speed}
            />
        </div>
    );
};

export default TrainLivePage;
