import { Train, MapPin } from "lucide-react";

interface Station {
    name: string;
    code: string;
    distance?: string; // Distance from previous station or start
    weather?: string;
}

interface TrainJourneyTrackProps {
    route: Station[];
    currentStationName: string;
}

const TrainJourneyTrack = ({
    route,
    currentStationName
}: TrainJourneyTrackProps) => {
    // Find index of current station to determine progress
    const currentIndex = route.findIndex(s => s.name === currentStationName);
    const progressPercentage = currentIndex !== -1
        ? (currentIndex / (route.length - 1)) * 100
        : 0;

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden mt-3">
            <div className="bg-slate-100 dark:bg-slate-700 px-4 py-2 border-b border-slate-200 dark:border-slate-600">
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Journey Route</h3>
            </div>

            <div className="p-6 overflow-x-auto">
                <div className="relative min-w-[800px] py-8">
                    {/* Main Track Line */}
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-300 dark:bg-gray-600 -translate-y-1/2 rounded-full"></div>

                    {/* Progress Line (Blue Bold) */}
                    <div
                        className="absolute top-1/2 left-0 h-1.5 bg-blue-600 -translate-y-1/2 rounded-full transition-all duration-1000 ease-in-out"
                        style={{ width: `${progressPercentage}%` }}
                    ></div>

                    {/* Stations */}
                    <div className="flex justify-between items-center relative z-10 w-full">
                        {route.map((station, index) => {
                            const isCurrent = station.name === currentStationName;
                            const isPassed = currentIndex !== -1 && index <= currentIndex;
                            const isSource = index === 0;
                            const isDest = index === route.length - 1;

                            return (
                                <div key={index} className="flex flex-col items-center group relative">
                                    {/* Station Marker */}
                                    <div className={`
                                        w-4 h-4 rounded-full border-2 transition-all duration-300 z-20
                                        ${isCurrent
                                            ? "bg-blue-600 border-blue-200 ring-4 ring-blue-100 scale-125"
                                            : isPassed
                                                ? "bg-blue-600 border-blue-600"
                                                : "bg-white dark:bg-slate-800 border-gray-400 dark:border-gray-500"
                                        }
                                    `}>
                                        {isCurrent && (
                                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 animate-bounce">
                                                <div className="bg-blue-600 text-white p-1.5 rounded-lg shadow-lg">
                                                    <Train size={16} />
                                                </div>
                                                <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-blue-600 mx-auto"></div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Station Name */}
                                    <div className={`
                                        absolute top-6 text-xs font-medium whitespace-nowrap px-2 py-1 rounded transition-all
                                        ${isCurrent
                                            ? "text-blue-700 dark:text-blue-400 font-bold bg-blue-50 dark:bg-blue-900/20"
                                            : "text-gray-600 dark:text-gray-400"
                                        }
                                    `}>
                                        {station.name}
                                    </div>

                                    {/* Distance Label (to next station) */}
                                    {index < route.length - 1 && station.distance && (
                                        <div className="absolute left-[100%] top-1/2 -translate-y-1/2 w-32 text-center pointer-events-none">
                                            <div className="bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm inline-block">
                                                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap">
                                                    {station.distance}
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Weather Tooltip (Hover) */}
                                    {station.weather && (
                                        <div className="absolute bottom-full mb-2 hidden group-hover:block w-48 bg-black/80 text-white text-xs p-2 rounded z-30 pointer-events-none">
                                            {station.weather}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrainJourneyTrack;
