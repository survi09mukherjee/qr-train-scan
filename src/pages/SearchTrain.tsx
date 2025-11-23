import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, ArrowLeft, Loader2, Train, MapPin, Clock } from 'lucide-react';
import api from '../api/axios';

interface TrainResult {
    trainNumber: string;
    trainName: string;
    source: { name: string; departureTime: string };
    destination: { name: string; arrivalTime: string };
    duration: string;
}

const SearchTrain: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const sourceParam = searchParams.get('source');
    const destParam = searchParams.get('destination');

    const [trainNumber, setTrainNumber] = useState('');
    const [trains, setTrains] = useState<TrainResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (sourceParam && destParam) {
            fetchTrainsByRoute(sourceParam, destParam);
        }
    }, [sourceParam, destParam]);

    const fetchTrainsByRoute = async (source: string, destination: string) => {
        setLoading(true);
        setError('');
        try {
            const response = await api.get(`/trains/search?source=${encodeURIComponent(source)}&destination=${encodeURIComponent(destination)}`);
            if (response.data.success) {
                setTrains(response.data.data);
                if (response.data.data.length === 0) {
                    setError('No trains found for this route.');
                }
            } else {
                setError('Failed to fetch trains.');
            }
        } catch (err) {
            console.error(err);
            setError('Error fetching trains. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSearchByNumber = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!trainNumber.trim()) return;

        setLoading(true);
        setError('');

        try {
            const response = await api.get(`/trains/${trainNumber}`);
            if (response.data.success) {
                navigate(`/train/${trainNumber}/live`);
            } else {
                setError('Train not found');
            }
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to find train');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-4">
            <button
                onClick={() => navigate('/')}
                className="mb-6 flex items-center text-gray-400 hover:text-white"
            >
                <ArrowLeft size={20} className="mr-2" /> Back to Home
            </button>

            <div className="max-w-4xl mx-auto">
                {sourceParam && destParam ? (
                    // Results View
                    <div>
                        <h2 className="text-2xl font-bold mb-2">Trains from {sourceParam} to {destParam}</h2>
                        <p className="text-gray-400 mb-6">{trains.length} trains found</p>

                        {loading ? (
                            <div className="flex justify-center py-12">
                                <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                            </div>
                        ) : error ? (
                            <div className="bg-red-500/20 border border-red-500/50 p-4 rounded-lg text-red-200 text-center">
                                {error}
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                {trains.map((train) => (
                                    <div
                                        key={train.trainNumber}
                                        onClick={() => navigate(`/train/${train.trainNumber}/live`)}
                                        className="bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-blue-500 cursor-pointer transition-all hover:shadow-lg group"
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="bg-blue-900 text-blue-200 text-xs font-bold px-2 py-1 rounded">#{train.trainNumber}</span>
                                                    <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">{train.trainName}</h3>
                                                </div>
                                                <div className="flex items-center gap-4 text-sm text-gray-400 mt-2">
                                                    <div className="flex items-center gap-1">
                                                        <Clock size={14} />
                                                        <span>{train.duration}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Train size={14} />
                                                        <span>Daily</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
                                                    Track Live
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between bg-gray-900/50 p-4 rounded-lg">
                                            <div>
                                                <div className="text-xs text-gray-500 uppercase font-bold mb-1">Departure</div>
                                                <div className="text-lg font-bold text-white">{train.source.departureTime}</div>
                                                <div className="text-sm text-gray-400">{train.source.name}</div>
                                            </div>
                                            <div className="flex-1 px-4 flex flex-col items-center">
                                                <div className="w-full h-0.5 bg-gray-700 relative">
                                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-gray-500 rounded-full"></div>
                                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-gray-500 rounded-full"></div>
                                                </div>
                                                <span className="text-xs text-gray-500 mt-2">View Route</span>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-xs text-gray-500 uppercase font-bold mb-1">Arrival</div>
                                                <div className="text-lg font-bold text-white">{train.destination.arrivalTime}</div>
                                                <div className="text-sm text-gray-400">{train.destination.name}</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    // Search by Number View (Fallback)
                    <div className="max-w-md mx-auto mt-10">
                        <h2 className="text-2xl font-bold mb-6 text-center">Search Train by Number</h2>
                        <form onSubmit={handleSearchByNumber} className="space-y-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    value={trainNumber}
                                    onChange={(e) => setTrainNumber(e.target.value)}
                                    placeholder="Enter 5-digit Train Number"
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    maxLength={5}
                                />
                            </div>
                            {error && (
                                <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm text-center">
                                    {error}
                                </div>
                            )}
                            <button
                                type="submit"
                                disabled={loading || trainNumber.length < 5}
                                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center"
                            >
                                {loading ? <Loader2 className="animate-spin mr-2" /> : 'Search Train'}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchTrain;
