import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, MapPin, Clock, Train, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface TrainData {
  trainNumber: string;
  trainName: string;
  currentLocation: string;
  nextStation: string;
  status: "on-time" | "delayed" | "running";
  delay?: number;
  platform?: string;
  speed?: number;
  eta?: string;
  latitude: number;
  longitude: number;
}

const TrainDetails = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const qrCode = searchParams.get("code");
  const [trainData, setTrainData] = useState<TrainData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching train data based on QR code
    const fetchTrainData = () => {
      setTimeout(() => {
        // Mock data - in real app, this would come from an API
        const mockData: TrainData = {
          trainNumber: "12951",
          trainName: "Mumbai Rajdhani",
          currentLocation: "Approaching Vadodara Junction",
          nextStation: "Vadodara Junction",
          status: "running",
          platform: "3",
          speed: 110,
          eta: "14:30",
          latitude: 22.3072,
          longitude: 73.1812,
        };
        setTrainData(mockData);
        setLoading(false);
      }, 1500);
    };

    fetchTrainData();
    
    // Simulate live updates every 10 seconds
    const interval = setInterval(() => {
      setTrainData(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          speed: Math.floor(Math.random() * 30) + 90,
        };
      });
    }, 10000);

    return () => clearInterval(interval);
  }, [qrCode]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-foreground font-medium">Loading train details...</p>
        </div>
      </div>
    );
  }

  if (!trainData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary flex items-center justify-center">
        <Card className="p-8 text-center">
          <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Train Not Found</h2>
          <p className="text-muted-foreground mb-4">Unable to load train details</p>
          <Button onClick={() => navigate("/")}>Go Back</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="rounded-full"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Train Details</h1>
            <p className="text-muted-foreground">Live tracking information</p>
          </div>
        </div>

        {/* Train Info Card */}
        <Card className="p-6 mb-6 bg-primary">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center">
                <Train className="w-6 h-6 text-accent-foreground" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-primary-foreground">
                  {trainData.trainNumber}
                </h2>
                <p className="text-primary-foreground/90">{trainData.trainName}</p>
              </div>
            </div>
            <Badge className="bg-accent text-accent-foreground">
              <CheckCircle2 className="w-4 h-4 mr-1" />
              {trainData.status === "on-time" ? "On Time" : "Running"}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="bg-primary-foreground/10 rounded-xl p-4">
              <p className="text-primary-foreground/70 text-sm mb-1">Platform</p>
              <p className="text-2xl font-bold text-primary-foreground">{trainData.platform}</p>
            </div>
            <div className="bg-primary-foreground/10 rounded-xl p-4">
              <p className="text-primary-foreground/70 text-sm mb-1">Current Speed</p>
              <p className="text-2xl font-bold text-primary-foreground">{trainData.speed} km/h</p>
            </div>
          </div>
        </Card>

        {/* Location Card */}
        <Card className="p-6 mb-6 bg-card">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
              <MapPin className="w-6 h-6 text-accent-foreground" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-card-foreground mb-2">
                Current Location
              </h3>
              <p className="text-lg text-muted-foreground mb-4">{trainData.currentLocation}</p>
              
              <div className="bg-muted rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Next Station</span>
                  <span className="text-sm font-medium text-foreground">{trainData.nextStation}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">ETA</span>
                  <span className="text-sm font-medium text-foreground">{trainData.eta}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Map Placeholder */}
        <Card className="p-6 bg-card">
          <h3 className="text-xl font-semibold text-card-foreground mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-accent" />
            Live Location Map
          </h3>
          <div className="w-full h-64 bg-muted rounded-xl flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-12 h-12 text-accent mx-auto mb-2 animate-pulse" />
              <p className="text-muted-foreground">
                Lat: {trainData.latitude.toFixed(4)}, Long: {trainData.longitude.toFixed(4)}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Live tracking active
              </p>
            </div>
          </div>
        </Card>

        {/* Additional Info */}
        <Card className="mt-6 p-6 bg-secondary">
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-accent mt-1" />
            <div>
              <h4 className="font-semibold text-foreground mb-1">Real-Time Updates</h4>
              <p className="text-sm text-muted-foreground">
                Location updates every 10 seconds. Data refreshes automatically.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TrainDetails;
