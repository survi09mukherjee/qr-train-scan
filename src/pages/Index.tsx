import React from 'react';
import { useNavigate } from 'react-router-dom';
import { QrCode, Search } from 'lucide-react';

const Index: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2 text-blue-400">Rail Scan</h1>
          <p className="text-gray-400">Indian Railway Information System</p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <button
            onClick={() => navigate('/scan')}
            className="flex items-center justify-center gap-3 p-6 bg-blue-600 hover:bg-blue-700 rounded-xl transition-all transform hover:scale-105 shadow-lg"
          >
            <QrCode size={32} />
            <span className="text-xl font-semibold">Scan QR Code</span>
          </button>

          <button
            onClick={() => navigate('/search')}
            className="flex items-center justify-center gap-3 p-6 bg-gray-800 hover:bg-gray-700 rounded-xl transition-all transform hover:scale-105 shadow-lg border border-gray-700"
          >
            <Search size={32} />
            <span className="text-xl font-semibold">Enter Train Number</span>
          </button>
        </div>

        <div className="text-center text-sm text-gray-500 mt-8">
          <p>Scan a train QR code or enter number to get live status</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
