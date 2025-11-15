import { Train, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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

        {/* Quick Track Section */}
        <Card className="p-6 mb-6 bg-primary shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <svg 
                  className="w-6 h-6 text-primary-foreground" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M13 10V3L4 14h7v7l9-11h-7z" 
                  />
                </svg>
                <h2 className="text-2xl font-bold text-primary-foreground">Track My Train</h2>
              </div>
              <p className="text-primary-foreground/90">Scan QR code for real-time tracking</p>
            </div>
            <Button 
              onClick={() => navigate('/qr-scanner')}
              className="bg-accent hover:bg-orange-hover text-accent-foreground font-semibold px-6 py-6 text-lg"
            >
              Track Now
            </Button>
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
                Get live updates on train location, delays, platform changes, and arrival times. 
                Never miss your train again.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Index;
