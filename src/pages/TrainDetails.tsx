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
        <h3 className="font-bold mb-4 flex items-center gap-2">
          <MapPin size={18} className="text-blue-400" />
          Live Journey Route
        </h3>

        <div className="overflow-x-auto pb-2">
          <div className="flex items-start justify-between min-w-[300px] relative px-4">
            {/* Connecting Line */}
            <div className="absolute top-[20px] left-8 right-8 h-0.5 bg-gray-700"></div>

            {(() => {
              // Find current station index
              const currentStationName = train.live_status?.current_station;
              const currentIndex = train.route.findIndex(s => s.name === currentStationName);

              // Determine stations to show
              // If we can't find the current station, default to showing start of route or handle gracefully
              // For now, let's assume we can find it or default to 0
              const activeIndex = currentIndex !== -1 ? currentIndex : 0;

              const prevStation = activeIndex > 0 ? train.route[activeIndex - 1] : null;
              const currentStation = train.route[activeIndex];
              const nextStation = activeIndex < train.route.length - 1 ? train.route[activeIndex + 1] : null;

              return (
                <>
                  {/* Previous Station */}
                  <div className="flex flex-col items-center gap-2 relative z-10 min-w-[80px]">
                    <div className={`w-4 h-4 rounded-full border-2 ${prevStation ? 'bg-gray-800 border-gray-500' : 'bg-transparent border-transparent'}`}>
                      {prevStation && <div className="w-2 h-2 rounded-full bg-gray-500 m-0.5"></div>}
                    </div>
                    {prevStation ? (
                      <div className="text-center">
                        <p className="text-xs font-medium text-gray-400">{prevStation.name}</p>
                        <p className="text-[10px] text-gray-500">Prev</p>
                        <p className="text-[10px] text-gray-600">{prevStation.departureTime}</p>
                      </div>
                    ) : (
                      <div className="text-center opacity-0">
                        <p className="text-xs">Start</p>
                      </div>
                    )}
                  </div>

                  {/* Current Station */}
                  <div className="flex flex-col items-center gap-2 relative z-10 min-w-[100px]">
                    <div className="w-6 h-6 rounded-full bg-blue-500/20 border-2 border-blue-500 flex items-center justify-center animate-pulse">
                      <Train size={14} className="text-blue-400" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold text-blue-400">{currentStation?.name || 'Unknown'}</p>
                      <p className="text-[10px] text-blue-300 font-medium uppercase tracking-wider">Current Station</p>
                      <p className="text-[10px] text-gray-400">
                        {currentStation?.arrivalTime === 'Source' ? currentStation?.departureTime : currentStation?.arrivalTime}
                      </p>
                    </div>
                  </div>

                  {/* Next Station */}
                  <div className="flex flex-col items-center gap-2 relative z-10 min-w-[80px]">
                    <div className={`w-4 h-4 rounded-full border-2 ${nextStation ? 'bg-gray-800 border-orange-500' : 'bg-transparent border-transparent'}`}>
                      {nextStation && <div className="w-2 h-2 rounded-full bg-orange-500 m-0.5"></div>}
                    </div>
                    {nextStation ? (
                      <div className="text-center">
                        <p className="text-xs font-medium text-gray-400">{nextStation.name}</p>
                        <p className="text-[10px] text-gray-500">Next</p>
                        <p className="text-[10px] text-gray-600">{nextStation.arrivalTime}</p>
                      </div>
                    ) : (
                      <div className="text-center opacity-0">
                        <p className="text-xs">End</p>
                      </div>
                    )}
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainDetails;
