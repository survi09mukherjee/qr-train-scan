import { Train, MapPin, Search, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center">
            <Train className="w-8 h-8 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Where is My Train</h1>
            <p className="text-muted-foreground">Live Train Tracking & Status</p>
          </div>
        </header>

        {/* PNR Status Card */}
        <div className="mb-6">
          <Card 
            className="p-6 hover:shadow-lg transition-shadow cursor-pointer bg-card"
            onClick={() => navigate('/pnr-status')}
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-accent rounded-2xl flex items-center justify-center">
                <MapPin className="w-7 h-7 text-accent-foreground" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-card-foreground">PNR Status</h2>
              </div>
            </div>
          </Card>
        </div>

        {/* Track My Train */}
        <Card className="p-6 mb-6 bg-primary shadow-lg">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 bg-accent rounded-2xl flex items-center justify-center">
              <Zap className="w-7 h-7 text-accent-foreground" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-primary-foreground mb-1">Track My Train</h2>
              <p className="text-primary-foreground/70">Enter train number for real-time tracking</p>
            </div>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const trainNumber = formData.get("trainNumber") as string;
              if (trainNumber.trim()) {
                navigate(`/train-details?train=${encodeURIComponent(trainNumber.trim())}`);
              }
            }}
            className="flex gap-2"
          >
            <Input
              name="trainNumber"
              placeholder="Enter Train Number (e.g., 12951)"
              className="flex-1 h-12 bg-white/10 border-white/20 text-primary-foreground placeholder:text-primary-foreground/50"
              required
            />
            <Button
              type="submit"
              className="bg-accent hover:bg-orange-hover text-accent-foreground px-6 h-12"
            >
              <Search className="w-5 h-5" />
            </Button>
          </form>
        </Card>

        {/* Additional Options */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Station Control Card */}
          <Card 
            className="p-6 bg-card hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => navigate('/station-control')}
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-navy rounded-2xl flex items-center justify-center">
                <Train className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-card-foreground mb-1">Station Control</h3>
                <p className="text-muted-foreground text-sm">Cabin view monitoring system</p>
              </div>
            </div>
          </Card>

          {/* Real-Time Tracking Info */}
          <Card className="p-6 bg-card">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
                <svg 
                  className="w-6 h-6 text-accent-foreground" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" 
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-card-foreground mb-2">Real-Time Tracking</h3>
                <p className="text-muted-foreground">
                  Get live updates on train location and arrival times.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
