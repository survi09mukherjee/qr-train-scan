import React from 'react';
import { useNavigate } from 'react-router-dom';
import { QrCode, Search } from 'lucide-react';

const Index: React.FC = () => {
  const navigate = useNavigate();
  const [source, setSource] = React.useState('');
  const [destination, setDestination] = React.useState('');

  const stations = [
    "Chennai Central",
    "Arakkonam Junction",
    "Katpadi Junction",
    "Salem Junction",
    "Erode Junction",
    "Tiruppur",
    "Coimbatore Junction"
  ];

  const handleSearch = () => {
    if (source && destination) {
      // For now, just navigate to search results or a generic search page with query params
      // Since the user wants to see trains for this route, and all trains in our data are for this route,
      // we can just show the list. But let's simulate a search.
      navigate(`/search?source=${encodeURIComponent(source)}&destination=${encodeURIComponent(destination)}`);
    } else {
      alert("Please select both Source and Destination");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2 text-blue-400">Rail Scan</h1>
          <p className="text-gray-400">Indian Railway Information System</p>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 space-y-4">
          <h2 className="text-xl font-semibold text-center mb-4">Search Trains</h2>

          <div className="space-y-2">
            <label className="text-sm text-gray-400">Source Station</label>
            <select
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 text-white focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">Select Source</option>
              {stations.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-400">Destination Station</label>
            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 text-white focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">Select Destination</option>
              {stations.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <button
            onClick={handleSearch}
            className="w-full flex items-center justify-center gap-2 p-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-all font-semibold mt-4"
          >
            <Search size={20} />
            Search Trains
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <button
            onClick={() => navigate('/scan')}
            className="flex items-center justify-center gap-3 p-4 bg-gray-800 hover:bg-gray-700 rounded-xl transition-all border border-gray-700"
          >
            <QrCode size={24} />
            <span className="text-lg font-medium">Scan QR Code</span>
          </button>
        </div>

        <div className="text-center text-sm text-gray-500 mt-8">
          <p>Scan a train QR code or search to get live status</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
