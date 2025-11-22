import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import api from '../api/axios';

const QRScanner: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      /* verbose= */ false
    );

    scanner.render(onScanSuccess, onScanFailure);

    function onScanSuccess(decodedText: string, decodedResult: any) {
      // Handle the scanned code as you like, for example:
      console.log(`Code matched = ${decodedText}`, decodedResult);
      handleScan(decodedText);
      // Stop scanning after success if desired
      scanner.clear().catch(error => console.error("Failed to clear scanner. ", error));
    }

    function onScanFailure(error: any) {
      // handle scan failure, usually better to ignore and keep scanning.
      // for example:
      // console.warn(`Code scan error = ${error}`);
    }

    return () => {
      scanner.clear().catch(error => console.error("Failed to clear scanner. ", error));
    };
  }, []);

  const handleScan = async (qrData: string) => {
    if (qrData && !loading) {
      setLoading(true);
      setError('');
      try {
        console.log('Scanned:', qrData);
        const response = await api.post('/scan', { qrData });

        if (response.data.success) {
          const trainNumber = response.data.data.trainNumber;
          navigate(`/train/${trainNumber}`);
        }
      } catch (err: any) {
        console.error('Scan Error:', err);
        setError(err.response?.data?.error || 'Failed to process QR code');
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <div className="p-4 flex items-center">
        <button
          onClick={() => navigate('/')}
          className="text-gray-400 hover:text-white"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="ml-4 text-xl font-bold">Scan QR Code</h1>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-sm bg-black rounded-xl overflow-hidden relative border-2 border-blue-500/50 shadow-2xl shadow-blue-500/20">
          {loading && (
            <div className="absolute inset-0 z-10 bg-black/80 flex flex-col items-center justify-center">
              <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
              <p className="text-blue-400 font-medium">Processing Scan...</p>
            </div>
          )}

          <div id="reader" className="w-full"></div>

        </div>

        {error && (
          <div className="mt-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl flex items-center text-red-200 max-w-sm w-full">
            <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        <p className="mt-6 text-gray-400 text-center text-sm">
          Point your camera at a valid Train QR Code
        </p>
      </div>
    </div>
  );
};

export default QRScanner;
