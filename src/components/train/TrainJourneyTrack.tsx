import { Train } from "lucide-react";

interface TrainJourneyTrackProps {
    trainNumber: string;
    trainName: string;
    source: string;
    previousStation: string;
    nextStation: string;
    destination: string;
}

const TrainJourneyTrack = ({
    trainNumber,
    trainName,
    source,
    previousStation,
    nextStation,
    destination
}: TrainJourneyTrackProps) => {
    return (
        <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
            {/* Rail Track Container */}
            <div className="relative py-12">
                {/* Horizontal Rail Track */}
                <div className="absolute top-1/2 left-0 w-full -translate-y-1/2">
                    {/* Track base */}
                    <div className="h-3 bg-gray-700 rounded-full relative">
                        {/* Track highlights */}
                        <div className="absolute inset-0 bg-gradient-to-r from-gray-600 via-gray-500 to-gray-600 rounded-full opacity-50"></div>
                        {/* Rail ties */}
                        <div className="absolute inset-0 flex justify-around items-center px-4">
                            {[...Array(20)].map((_, i) => (
                                <div key={i} className="w-1 h-6 bg-gray-600 rounded"></div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Stations and Train Layout */}
                <div className="relative flex items-center justify-between">
                    {/* LEFT SIDE - Source and Previous Station */}
                    <div className="flex flex-col gap-8 items-end pr-8 w-1/3">
                        {/* Source Station */}
                        <div className="flex items-center gap-3">
                            <div className="text-right">
                                <div className="text-xs text-gray-400 uppercase tracking-wider">Source</div>
                                <div className="text-lg font-bold text-blue-400">{source}</div>
                            </div>
                            <div className="w-5 h-5 rounded-full bg-green-500 ring-4 ring-green-500/30 flex-shrink-0"></div>
                        </div>

                        {/* Previous Station */}
                        <div className="flex items-center gap-3">
                            <div className="text-right">
                                <div className="text-xs text-gray-400 uppercase tracking-wider">Previous Station</div>
                                <div className="text-base font-semibold text-gray-200">{previousStation}</div>
                            </div>
                            <div className="w-4 h-4 rounded-full bg-gray-500 ring-4 ring-gray-500/30 flex-shrink-0"></div>
                        </div>
                    </div>

                    {/* CENTER - Main Train */}
                    <div className="flex flex-col items-center z-10 px-4">
                        <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-2xl shadow-2xl border-2 border-blue-400 relative">
                            {/* Train Icon */}
                            <Train className="h-12 w-12 text-white" />

                            {/* Animated glow */}
                            <div className="absolute inset-0 bg-blue-400 rounded-2xl opacity-20 animate-pulse"></div>
                        </div>

                        {/* Train Info Below */}
                        <div className="mt-4 bg-gray-900 px-6 py-3 rounded-xl border border-blue-500/50 shadow-lg">
                            <div className="text-center">
                                <div className="text-xs text-blue-400 font-semibold uppercase tracking-wider">Train #{trainNumber}</div>
                                <div className="text-sm font-bold text-white mt-1">{trainName}</div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT SIDE - Next Station and Destination */}
                    <div className="flex flex-col gap-8 items-start pl-8 w-1/3">
                        {/* Next Station */}
                        <div className="flex items-center gap-3">
                            <div className="w-4 h-4 rounded-full bg-orange-500 ring-4 ring-orange-500/30 flex-shrink-0"></div>
                            <div className="text-left">
                                <div className="text-xs text-gray-400 uppercase tracking-wider">Next Station</div>
                                <div className="text-base font-semibold text-gray-200">{nextStation}</div>
                            </div>
                        </div>

                        {/* Final Destination */}
                        <div className="flex items-center gap-3">
                            <div className="w-5 h-5 rounded-full bg-red-500 ring-4 ring-red-500/30 flex-shrink-0"></div>
                            <div className="text-left">
                                <div className="text-xs text-gray-400 uppercase tracking-wider">Final Destination</div>
                                <div className="text-lg font-bold text-red-400">{destination}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrainJourneyTrack;
