import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, Calendar, Train, Navigation } from 'lucide-react';
import api from '../api/axios';

interface Station {
  code: string;
  name: string;
  arrivalTime: string;
  departureTime: string;
  distance: number;
  day: number;
}

interface TrainData {
  trainNumber: string;
  trainName: string;
  type: string;
  source: { name: string; code: string; departureTime: string };
  destination: { name: string; code: string; arrivalTime: string };
  runningDays: string[];
  route: Station[];
  live_status?: {
    current_station: string;
    delay: string;
    status: string;
    last_updated: string;
  };
}

const TrainDetails: React.FC = () => {
  const { trainNumber } = useParams<{ trainNumber: string }>();
  const navigate = useNavigate();
  const [train, setTrain] = useState<TrainData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTrainDetails = async () => {
      try {
        const response = await api.get(`/trains/${trainNumber}`);
        if (response.data.success) {
          setTrain(response.data.data);
        } else {
          setError('Train details not found');
        }
      } catch (err) {
        setError('Failed to fetch train details');
      } finally {
        setLoading(false);
      }
    };

    if (trainNumber) {
      fetchTrainDetails();
    }
  }, [trainNumber]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !train) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-4 flex flex-col items-center justify-center">
        <p className="text-red-400 mb-4">{error}</p>
        <button onClick={() => navigate('/')} className="text-blue-400 hover:underline">
          Go Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white pb-8">
      {/* Header */}
      <div className="bg-gray-800 p-4 sticky top-0 z-10 shadow-lg">
        <div className="flex items-center mb-4">
          <button onClick={() => navigate('/')} className="mr-4 text-gray-400 hover:text-white">
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-xl font-bold">{train.trainName}</h1>
            <p className="text-sm text-gray-400">#{train.trainNumber} • {train.type}</p>
          </div>
        </div>

        {/* Live Status Card */}
        <div className="bg-gray-700/50 rounded-xl p-4 border border-gray-600">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Live Status</span>
            <span className={`px-2 py-1 rounded text-xs font-bold ${train.live_status?.status === 'On Time' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
              }`}>
              {train.live_status?.status || 'Unknown'}
            </span>
          </div>
          <div className="flex items-center gap-2 mb-1">
            <Navigation className="w-4 h-4 text-blue-400" />
            <span className="font-medium">{train.live_status?.current_station || 'Station info unavailable'}</span>
          </div>
          <p className="text-sm text-gray-400 pl-6">Delay: {train.live_status?.delay || 'N/A'}</p>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Route Info */}
        <div className="flex justify-between items-center bg-gray-800 rounded-xl p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-400">{train.source.code}</p>
            <p className="text-xs text-gray-400">{train.source.departureTime}</p>
          </div>
          <div className="flex-1 mx-4 flex flex-col items-center">
            <div className="w-full h-0.5 bg-gray-600 relative">
              <div className="absolute -top-1.5 left-0 w-3 h-3 rounded-full bg-gray-500"></div>
              <div className="absolute -top-1.5 right-0 w-3 h-3 rounded-full bg-gray-500"></div>
              <Train className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-400 bg-gray-800 p-1" size={20} />
            </div>
            <p className="text-xs text-gray-500 mt-2">Daily</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-400">{train.destination.code}</p>
            <p className="text-xs text-gray-400">{train.destination.arrivalTime}</p>
          </div>
        </div>

        {/* Route Timeline */}
        <div className="bg-gray-800 rounded-xl p-4">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <MapPin size={18} className="text-blue-400" />
            Route Information
          </h3>
          <div className="space-y-6 relative pl-2">
            <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-gray-700"></div>

            {train.route.map((station, index) => (
              <div key={index} className="relative flex items-start gap-4">
                <div className="w-6 h-6 rounded-full bg-gray-900 border-2 border-gray-600 z-10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-gray-600"></div>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-white">{station.name}</p>
                      <p className="text-xs text-gray-400">{station.code}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-mono text-blue-300">
                        {index === 0 ? station.departureTime : station.arrivalTime}
                      </p>
                      <p className="text-xs text-gray-500">{station.distance} km</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainDetails;
