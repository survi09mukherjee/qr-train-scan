import { useState } from "react";
import { Train, QrCode, Search, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Index = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'home' | 'search'>('home');

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const trainNumber = formData.get("trainNumber") as string;
    if (trainNumber.trim()) {
      navigate(`/train/${encodeURIComponent(trainNumber.trim())}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-950 dark:to-slate-900 flex flex-col items-center justify-center p-4">

      {/* Main Container */}
      <div className="w-full max-w-4xl mx-auto space-y-8">

        {/* Header */}
        <div className="text-center space-y-2 mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-blue-600 text-white shadow-xl mb-6 transform hover:scale-105 transition-transform duration-300">
            <Train className="w-10 h-10" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight">
            Where is My Train
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-md mx-auto">
            Live train tracking, real-time status, and instant updates.
          </p>
        </div>

        {viewMode === 'home' ? (
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {/* Scan QR Option */}
            <Card
              className="group relative overflow-hidden border-0 shadow-2xl hover:shadow-3xl transition-all duration-300 cursor-pointer bg-white dark:bg-slate-800 rounded-3xl h-64 flex flex-col items-center justify-center gap-4 hover:-translate-y-1"
              onClick={() => navigate('/scan')}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-20 h-20 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <QrCode className="w-10 h-10 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="text-center z-10">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Scan QR</h2>
                <p className="text-slate-500 dark:text-slate-400">Instant check-in via camera</p>
              </div>
            </Card>

            {/* Enter Train Number Option */}
            <Card
              className="group relative overflow-hidden border-0 shadow-2xl hover:shadow-3xl transition-all duration-300 cursor-pointer bg-white dark:bg-slate-800 rounded-3xl h-64 flex flex-col items-center justify-center gap-4 hover:-translate-y-1"
              onClick={() => setViewMode('search')}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-20 h-20 rounded-2xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Search className="w-10 h-10 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="text-center z-10">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Search Train</h2>
                <p className="text-slate-500 dark:text-slate-400">Enter number manually</p>
              </div>
            </Card>
          </div>
        ) : (
          /* Search View */
          <div className="max-w-md mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card className="p-8 border-0 shadow-2xl bg-white dark:bg-slate-800 rounded-3xl relative overflow-hidden">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 left-4 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
                onClick={() => setViewMode('home')}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>

              <div className="text-center mb-8 mt-4">
                <div className="w-16 h-16 mx-auto bg-orange-100 dark:bg-orange-900/30 rounded-2xl flex items-center justify-center mb-4">
                  <Train className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Track Your Train</h2>
                <p className="text-slate-500 dark:text-slate-400">Enter the 5-digit train number</p>
              </div>

              <form onSubmit={handleSearch} className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <Input
                    name="trainNumber"
                    placeholder="Ex: 12951"
                    className="h-14 pl-12 rounded-xl bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 text-lg focus-visible:ring-orange-500"
                    autoFocus
                    required
                    pattern="[0-9]*"
                    inputMode="numeric"
                    maxLength={5}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full h-14 text-lg font-semibold rounded-xl bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 shadow-lg shadow-orange-500/25 transition-all hover:scale-[1.02]"
                >
                  Search Train
                </Button>
              </form>
            </Card>
          </div>
        )}

        {/* Footer Info */}
        <div className="text-center mt-12 text-sm text-slate-400">
          <p>© 2024 Smart Rail Systems. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
