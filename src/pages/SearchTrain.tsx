import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowLeft, Loader2 } from 'lucide-react';
import api from '../api/axios';

const SearchTrain: React.FC = () => {
    const [trainNumber, setTrainNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!trainNumber.trim()) return;

        setLoading(true);
        setError('');

        try {
            // Verify train exists before navigating
            const response = await api.get(`/trains/${trainNumber}`);
            if (response.data.success) {
                navigate(`/train/${trainNumber}/live`);
            } else {
                setError('Train not found');
            }
        } catch (err: any) {
            if (!err.response) {
                setError('Server Unreachable. Please ensure the backend is running.');
            } else {
                setError(err.response?.data?.error || 'Failed to find train');
            }
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
                <ArrowLeft size={20} className="mr-2" /> Back
            </button>

            <div className="max-w-md mx-auto mt-10">
                <h2 className="text-2xl font-bold mb-6 text-center">Search Train</h2>

                <form onSubmit={handleSearch} className="space-y-4">
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
        </div>
    );
};

export default SearchTrain;
