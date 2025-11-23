import React from 'react';
import { useNavigate } from 'react-router-dom';
import { QrCode, Search, Train } from 'lucide-react';

const Index: React.FC = () => {
  const navigate = useNavigate();
  const [source, setSource] = React.useState('');
  const [destination, setDestination] = React.useState('');
  const [trainNumber, setTrainNumber] = React.useState('');

  const stations = [
    "Chennai Central",
    "Arakkonam Junction",
    "Katpadi Junction",
    "Salem Junction",
    "Erode Junction",
    "Tiruppur",
    "Coimbatore Junction"
  ];

  const handleSearchByLocation = () => {
    if (source && destination) {
      navigate(`/search?source=${encodeURIComponent(source)}&destination=${encodeURIComponent(destination)}`);
    } else {
      alert("Please select both Source and Destination");
    }
  };

  const handleSearchByTrainNumber = () => {
    if (trainNumber) {
      // Navigate to live status directly if number is entered
      navigate(`/train/${trainNumber}/live`);
    } else {
      alert("Please enter a train number");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 text-blue-400">Rail Scan</h1>
          <p className="text-gray-400">Indian Railway Information System</p>
        </div>

        {/* Section 1: Search by Location */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 space-y-4">
          <h2 className="text-lg font-semibold text-blue-300 flex items-center gap-2">
            <Search size={20} />
            Search by Location
          </h2>

          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs text-gray-400 uppercase font-bold">Source</label>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 text-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">Select Source Station</option>
                {stations.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-gray-400 uppercase font-bold">Destination</label>
              <select
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 text-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">Select Destination Station</option>
                {stations.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <button
              onClick={handleSearchByLocation}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-all font-semibold shadow-md"
            >
              Find Trains
            </button>
          </div>
        </div>

        {/* Section 2: Search by Train Number */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 space-y-4">
          <h2 className="text-lg font-semibold text-blue-300 flex items-center gap-2">
            <Train size={20} />
            Search by Train Number
          </h2>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter Train No. (e.g. 12675)"
              value={trainNumber}
              onChange={(e) => setTrainNumber(e.target.value)}
              className="flex-1 p-3 bg-gray-700 rounded-lg border border-gray-600 text-white focus:ring-2 focus:ring-blue-500 outline-none placeholder-gray-500"
            />
            <button
              onClick={handleSearchByTrainNumber}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-all font-semibold shadow-md whitespace-nowrap"
            >
              Search
            </button>
          </div>
        </div>

        {/* Section 3: Scan QR */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-blue-300 flex items-center gap-2">
              <QrCode size={20} />
              Scan QR Code
            </h2>
            <p className="text-xs text-gray-400 mt-1">Scan inside train for live status</p>
          </div>

          <button
            onClick={() => navigate('/scan')}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg transition-all font-semibold shadow-md flex items-center gap-2"
          >
            <QrCode size={20} />
            Scan Now
          </button>
        </div>

        <div className="text-center text-xs text-gray-500 mt-8">
          <p>Real-time train tracking & information system</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
