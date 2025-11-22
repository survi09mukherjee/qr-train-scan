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
import PreviousTrainCard from "@/components/train/PreviousTrainCard";
import NextTrainCard from "@/components/train/NextTrainCard";
import TimeCard from "@/components/train/TimeCard";
import WeatherWidget from "@/components/common/WeatherWidget";

const KOVAI_ROUTE = [
    { name: "CHENNAI CENTRAL", code: "MAS" },
    { name: "ARAKKONAM JN", code: "AJJ" },
    { name: "KATPADI JN", code: "KPD" },
    { name: "SALEM JN", code: "SA" },
    { name: "ERODE JN", code: "ED" },
    { name: "TIRUPPUR", code: "TUP" },
    { name: "COIMBATORE JN", code: "CBE" }
];

const TrainLivePage = () => {
    const { trainNumber } = useParams<{ trainNumber: string }>();
    const navigate = useNavigate();
    const [data, setData] = useState<TrainData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const loadData = async (isRefresh = false) => {
        if (!trainNumber) return;
        if (!isRefresh) setLoading(true);
        try {
            const result = await fetchLiveTrainData(trainNumber);
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
    }, [trainNumber]);

    if (loading && !data) return <Loader text="Fetching live train status..." />;
    if (error) return <ErrorState onRetry={() => loadData()} />;
    if (!data) return <ErrorState title="Train Not Found" message="We couldn't find details for this train." />;

    console.log("[DEBUG] TrainLivePage data:", {
        trainNumber: data.trainNumber,
        routeLength: data.route ? data.route.length : 0,
        route: data.route,
        currentLocation: data.currentLocation
    });

    return (
        <div className="h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 flex flex-col">
            {/* Compact Header */}
            <header className="flex-shrink-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="icon" onClick={() => navigate("/")} className="rounded-full h-8 w-8">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <div>
                            <h1 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                                {data.trainName}
                            </h1>
                            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                                <span className="bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded text-xs">#{data.trainNumber}</span>
                                <span className="text-xs">PNR: {data.pnr}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-1">
                        <Button variant="outline" size="icon" onClick={() => loadData(true)} className="rounded-full h-8 w-8">
                            <RefreshCw className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="outline" size="icon" className="rounded-full h-8 w-8">
                            <Share2 className="h-3.5 w-3.5" />
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 overflow-auto">
                <div className="max-w-7xl mx-auto px-4 py-3 space-y-3">
                    {/* Compact Grid: Map & Info */}
                    <div className="grid lg:grid-cols-3 gap-3">
                        {/* Left: Map and Station Cards */}
                        <div className="lg:col-span-2 space-y-0">
                            {/* Map Section */}
                            <div className="h-[280px] rounded-t-xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-800 border-b-0 relative z-0">
                                <TrainMap
                                    lat={data.lat}
                                    lng={data.lng}
                                    trainName={data.trainName}
                                />
                            </div>

                            {/* Station Cards - Directly below map */}
                            <div className="grid grid-cols-2 gap-0">
                                <div className="border border-slate-200 dark:border-slate-800 border-r-0">
                                    <PreviousStationCard
                                        name={data.previousStation.name}
                                        departureTime={data.previousStation.departureTime}
                                    />
                                </div>
                                <div className="border border-slate-200 dark:border-slate-800 rounded-br-xl">
                                    <UpcomingStationCard
                                        name={data.upcomingStation.name}
                                        distance={data.upcomingStation.distance}
                                        eta={data.upcomingStation.eta}
                                    />
                                </div>
                            </div>

                            {/* Previous and Next Train Cards */}
                            <div className="grid grid-cols-2 gap-3 mt-3">
                                <PreviousTrainCard
                                    name={data.previousTrain.name}
                                    number={data.previousTrain.number}
                                    departureTime={data.previousTrain.departureTime}
                                    status={data.previousTrain.status}
                                />
                                <NextTrainCard
                                    name={data.nextTrain.name}
                                    number={data.nextTrain.number}
                                    eta={data.nextTrain.eta}
                                    status={data.nextTrain.status}
                                />
                            </div>


                            {/* Route Info - Horizontal Station Timeline (Source, Prev, Curr, Next, Dest) */}
                            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden mt-3">
                                <div className="bg-slate-100 dark:bg-slate-700 px-4 py-2 border-b border-slate-200 dark:border-slate-600">
                                    <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Journey Route</h3>
                                </div>
                                <div className="p-4 overflow-x-auto">
                                    <div className="flex items-start min-w-full relative w-full px-2 gap-4">
                                        <div className="absolute top-[20px] left-4 right-4 h-0.5 bg-slate-300 dark:bg-slate-600 z-0"></div>

                                        {(data.route && data.route.length > 0 ? data.route : (
                                            data.trainNumber === "12675" ? KOVAI_ROUTE : [
                                                { name: data.source, isSource: true },
                                                { name: data.previousStation.name, label: "Prev" },
                                                { name: data.currentLocation.name, isCurrent: true },
                                                { name: data.upcomingStation.name, label: "Next" },
                                                { name: data.destination, isDest: true }
                                            ].filter(s => s.name && s.name !== "Unknown"))).map((station: any, index: number, arr: any[]) => {
                                                const isSource = index === 0;
                                                const isDest = index === arr.length - 1;
                                                const isCurrent = station.name === data.currentLocation.name || station.isCurrent;

                                                // Determine passed status
                                                let isPassed = false;
                                                if (data.route && data.route.length > 0) {
                                                    const currentIndex = data.route.findIndex(s => s.name === data.currentLocation.name);
                                                    isPassed = currentIndex !== -1 && index < currentIndex;
                                                } else {
                                                    // Fallback logic for summary view
                                                    isPassed = index < arr.findIndex((s: any) => s.name === data.currentLocation.name || s.isCurrent);
                                                }

                                                return (
                                                    <div key={index} className="flex flex-col items-center gap-1 relative z-10 min-w-[80px]">
                                                        {isCurrent ? (
                                                            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg border-2 border-blue-500 px-2 py-1 flex flex-col items-center shadow-sm -mt-2 mb-1 bg-white">
                                                                <div className="w-3 h-3 rounded-full bg-blue-600 ring-4 ring-blue-200 animate-pulse mb-1"></div>
                                                                <div className="text-[10px] font-bold text-blue-700 dark:text-blue-400 whitespace-nowrap">Current</div>
                                                            </div>
                                                        ) : (
                                                            <div className={`w-3 h-3 rounded-full ${isSource ? "bg-green-500 ring-2 ring-green-100" :
                                                                isDest ? "bg-red-500 ring-2 ring-red-100" :
                                                                    isPassed ? "bg-slate-400" : "bg-orange-500"
                                                                } mb-6`}></div>
                                                        )}

                                                        <div className={`text-xs text-center whitespace-nowrap max-w-[100px] truncate ${isCurrent ? "font-bold text-blue-700" : "text-slate-600 dark:text-slate-400"}`}>
                                                            {station.name}
                                                        </div>

                                                        <div className="text-[10px] text-slate-500">
                                                            {isSource ? "Source" : isDest ? "Dest" : station.label || ""}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Side Cards */}
                        <div className="space-y-2 flex flex-col">
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
                </div>
            </div>
        </div>
    );
};

export default TrainLivePage;
