import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, ArrowLeft, Loader2, Train, MapPin, Clock, QrCode } from 'lucide-react';
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

    const [source, setSource] = useState(sourceParam || '');
    const [destination, setDestination] = useState(destParam || '');
    const [trainNumber, setTrainNumber] = useState('');

    const [trains, setTrains] = useState<TrainResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // If URL params exist, trigger search automatically
    useEffect(() => {
        if (sourceParam && destParam) {
            setSource(sourceParam);
            setDestination(destParam);
            fetchTrainsByRoute(sourceParam, destParam);
        }
    }, [sourceParam, destParam]);

    const fetchTrainsByRoute = async (src: string, dest: string) => {
        setLoading(true);
        setError('');
        try {
            const response = await api.get(`/trains/searchByLocation?source=${encodeURIComponent(src)}&destination=${encodeURIComponent(dest)}`);
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

    const handleLocationSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!source.trim() || !destination.trim()) return;
        // Update URL to reflect search
        navigate(`/?source=${encodeURIComponent(source)}&destination=${encodeURIComponent(destination)}`);
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
            <div className="max-w-6xl mx-auto">
                <header className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-blue-400 flex items-center justify-center gap-2">
                        <Train className="w-8 h-8" />
                        RailTrack
                    </h1>
                    <p className="text-gray-400 mt-2">Track your train live</p>
                </header>

                {/* Main Sections Grid */}
                {!sourceParam && !destParam && (
                    <div className="grid md:grid-cols-3 gap-6 mb-12">
                        {/* Section 1: Search by Location */}
                        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-blue-500 transition-all">
                            <div className="flex items-center gap-3 mb-4 text-blue-400">
                                <MapPin className="w-6 h-6" />
                                <h2 className="text-xl font-bold">Search by Route</h2>
                            </div>
                            <form onSubmit={handleLocationSearch} className="space-y-4">
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">Source Station</label>
                                    <input
                                        type="text"
                                        value={source}
                                        onChange={(e) => setSource(e.target.value)}
                                        placeholder="e.g. MAS, Chennai"
                                        className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">Destination Station</label>
                                    <input
                                        type="text"
                                        value={destination}
                                        onChange={(e) => setDestination(e.target.value)}
                                        placeholder="e.g. CBE, Coimbatore"
                                        className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors"
                                >
                                    Find Trains
                                </button>
                            </form>
                        </div>

                        {/* Section 2: Search by Train Number */}
                        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-green-500 transition-all">
                            <div className="flex items-center gap-3 mb-4 text-green-400">
                                <Search className="w-6 h-6" />
                                <h2 className="text-xl font-bold">Search by Number</h2>
                            </div>
                            <form onSubmit={handleSearchByNumber} className="space-y-4">
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">Train Number</label>
                                    <input
                                        type="text"
                                        value={trainNumber}
                                        onChange={(e) => setTrainNumber(e.target.value)}
                                        placeholder="e.g. 12675"
                                        maxLength={5}
                                        className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-green-500 outline-none"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-colors"
                                >
                                    Track Live
                                </button>
                            </form>
                        </div>

                        {/* Section 3: Scan QR */}
                        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-purple-500 transition-all flex flex-col">
                            <div className="flex items-center gap-3 mb-4 text-purple-400">
                                <QrCode className="w-6 h-6" />
                                <h2 className="text-xl font-bold">Scan QR Code</h2>
                            </div>
                            <p className="text-gray-400 text-sm mb-6 flex-grow">
                                Scan the QR code on the train to instantly get live status, route details, and more.
                            </p>
                            <button
                                onClick={() => navigate('/scan')}
                                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                            >
                                <QrCode className="w-5 h-5" />
                                Start Scanning
                            </button>
                        </div>
                    </div>
                )}

                {/* Results View (if params exist) */}
                {(sourceParam || destParam) && (
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold">Trains from {sourceParam} to {destParam}</h2>
                            <button
                                onClick={() => navigate('/')}
                                className="text-blue-400 hover:text-blue-300 flex items-center gap-1"
                            >
                                <ArrowLeft size={16} /> New Search
                            </button>
                        </div>

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
                )}
            </div>
        </div>
    );
};

export default SearchTrain;
