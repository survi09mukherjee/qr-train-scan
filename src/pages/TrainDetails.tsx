import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, MapPin, Clock, Train, CheckCircle2, AlertCircle, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Station {
  name: string;
  arrivalTime: string;
  departureTime: string;
  platform: string;
  distance: number;
  isPassed: boolean;
  isCurrent: boolean;
}

interface TrainData {
  trainNumber: string;
  trainName: string;
  currentStation: string;
  source: string;
  destination: string;
  status: "on-time" | "delayed" | "running";
  currentDateTime: string;
  latitude: number;
  longitude: number;
  speed: number;
  progress: number;
  stations: Station[];
  previousStations: Station[];
  upcomingStations: Station[];
}

const TrainDetails = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const trainNumber = searchParams.get("train") || searchParams.get("code");
  const [trainData, setTrainData] = useState<TrainData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching train data based on train number
    const fetchTrainData = () => {
      setTimeout(() => {
        // Mock data - in real app, this would come from an API
        const mockStations: Station[] = [
          { name: "Mumbai Central", arrivalTime: "16:55", departureTime: "16:55", platform: "1", distance: 0, isPassed: true, isCurrent: false },
          { name: "Surat", arrivalTime: "21:10", departureTime: "21:15", platform: "2", distance: 264, isPassed: true, isCurrent: false },
          { name: "Vadodara Junction", arrivalTime: "22:45", departureTime: "22:50", platform: "3", distance: 390, isPassed: true, isCurrent: false },
          { name: "Ratlam Junction", arrivalTime: "02:15", departureTime: "02:20", platform: "4", distance: 615, isPassed: false, isCurrent: true },
          { name: "Kota Junction", arrivalTime: "06:30", departureTime: "06:35", platform: "5", distance: 865, isPassed: false, isCurrent: false },
          { name: "Sawai Madhopur", arrivalTime: "08:15", departureTime: "08:17", platform: "2", distance: 990, isPassed: false, isCurrent: false },
          { name: "New Delhi", arrivalTime: "11:30", departureTime: "11:30", platform: "16", distance: 1384, isPassed: false, isCurrent: false },
        ];

        const currentIndex = mockStations.findIndex(s => s.isCurrent);
        
        const mockData: TrainData = {
          trainNumber: trainNumber || "12951",
          trainName: "Mumbai Rajdhani Express",
          currentStation: mockStations[currentIndex].name,
          source: mockStations[0].name,
          destination: mockStations[mockStations.length - 1].name,
          status: "running",
          currentDateTime: new Date().toLocaleString('en-IN', { 
            timeZone: 'Asia/Kolkata',
            dateStyle: 'medium',
            timeStyle: 'short'
          }),
          latitude: 23.3315,
          longitude: 75.0367,
          speed: 105,
          progress: ((currentIndex + 0.5) / (mockStations.length - 1)) * 100,
          stations: mockStations,
          previousStations: mockStations.slice(Math.max(0, currentIndex - 3), currentIndex),
          upcomingStations: mockStations.slice(currentIndex + 1, Math.min(mockStations.length, currentIndex + 4)),
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
          currentDateTime: new Date().toLocaleString('en-IN', { 
            timeZone: 'Asia/Kolkata',
            dateStyle: 'medium',
            timeStyle: 'short'
          }),
        };
      });
    }, 10000);

    return () => clearInterval(interval);
  }, [trainNumber]);

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
            <h1 className="text-3xl font-bold text-foreground">Train Tracking</h1>
            <p className="text-muted-foreground">Live location & journey details</p>
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

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-primary-foreground/10 rounded-xl p-4">
              <p className="text-primary-foreground/70 text-sm mb-1">Current Speed</p>
              <p className="text-2xl font-bold text-primary-foreground">{trainData.speed} km/h</p>
            </div>
            <div className="bg-primary-foreground/10 rounded-xl p-4">
              <p className="text-primary-foreground/70 text-sm mb-1">Current Station</p>
              <p className="text-lg font-bold text-primary-foreground truncate">{trainData.currentStation}</p>
            </div>
          </div>
        </Card>

        {/* Journey Progress */}
        <Card className="p-6 mb-6 bg-card">
          <h3 className="text-xl font-semibold text-card-foreground mb-4">Journey Progress</h3>
          
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">{trainData.source}</span>
              <span className="text-sm font-medium text-foreground">{trainData.destination}</span>
            </div>
            <div className="relative h-3 w-full overflow-hidden rounded-full bg-navy/20">
              <div 
                className="h-full transition-all rounded-full"
                style={{
                  width: `${trainData.progress}%`,
                  background: `linear-gradient(90deg, hsl(var(--navy)) 0%, hsl(var(--orange)) 100%)`
                }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              {Math.round(trainData.progress)}% Complete
            </p>
          </div>

          {/* Previous Stations */}
          {trainData.previousStations.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-navy"></div>
                Previous Stations
              </h4>
              <div className="space-y-2">
                {trainData.previousStations.map((station, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-navy/10 rounded-lg">
                    <div>
                      <p className="font-medium text-foreground">{station.name}</p>
                      <p className="text-xs text-muted-foreground">Platform {station.platform}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-foreground">{station.departureTime}</p>
                      <p className="text-xs text-muted-foreground">{station.distance} km</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Current Station */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-orange mb-3 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange animate-pulse"></div>
              Current Location
            </h4>
            <div className="p-4 bg-orange/20 border-2 border-orange rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-lg text-foreground">{trainData.currentStation}</p>
                  <p className="text-sm text-muted-foreground">
                    Platform {trainData.stations.find(s => s.isCurrent)?.platform}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-foreground">
                    {trainData.stations.find(s => s.isCurrent)?.arrivalTime}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {trainData.stations.find(s => s.isCurrent)?.distance} km
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming Stations */}
          {trainData.upcomingStations.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-muted-foreground"></div>
                Upcoming Stations
              </h4>
              <div className="space-y-2">
                {trainData.upcomingStations.map((station, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div>
                      <p className="font-medium text-foreground">{station.name}</p>
                      <p className="text-xs text-muted-foreground">Platform {station.platform}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-foreground">{station.arrivalTime}</p>
                      <p className="text-xs text-muted-foreground">{station.distance} km</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>

        {/* Location Details */}
        <Card className="p-6 mb-6 bg-card">
          <h3 className="text-xl font-semibold text-card-foreground mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-accent" />
            GPS Location
          </h3>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-muted rounded-lg p-4">
              <p className="text-xs text-muted-foreground mb-1">Latitude</p>
              <p className="text-lg font-bold text-foreground">{trainData.latitude.toFixed(4)}°</p>
            </div>
            <div className="bg-muted rounded-lg p-4">
              <p className="text-xs text-muted-foreground mb-1">Longitude</p>
              <p className="text-lg font-bold text-foreground">{trainData.longitude.toFixed(4)}°</p>
            </div>
          </div>

          <div className="bg-muted rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-accent" />
              <p className="text-xs text-muted-foreground">Current Date & Time</p>
            </div>
            <p className="text-base font-semibold text-foreground">{trainData.currentDateTime}</p>
          </div>
        </Card>

        {/* Live Updates Info */}
        <Card className="p-6 bg-secondary">
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-accent mt-1" />
            <div>
              <h4 className="font-semibold text-foreground mb-1">Real-Time Updates</h4>
              <p className="text-sm text-muted-foreground">
                Location and speed update every 10 seconds. All times shown in Indian Standard Time (IST).
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TrainDetails;
