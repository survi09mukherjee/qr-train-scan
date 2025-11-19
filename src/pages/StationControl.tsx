import { useEffect, useState } from "react";
import { Train, Sun, Cloud, CloudRain, Navigation } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface TrainInfo {
  number: string;
  name: string;
  status: "approaching" | "departed";
  location: string;
  distance?: string;
}

const StationControl = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [temperature] = useState(28);
  const [weather] = useState<"clear" | "cloudy" | "rainy">("clear");

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const approachingTrains: TrainInfo[] = [
    { number: "12951", name: "Mumbai Rajdhani", status: "approaching", location: "Vadodara Jn", distance: "45 km away" },
    { number: "12009", name: "Shatabdi Express", status: "approaching", location: "Anand Jn", distance: "78 km away" },
    { number: "19023", name: "FZR Janata Exp", status: "approaching", location: "Nadiad Jn", distance: "95 km away" },
  ];

  const departedTrains: TrainInfo[] = [
    { number: "12010", name: "Shatabdi Express", status: "departed", location: "Surat" },
    { number: "12952", name: "Mumbai Rajdhani", status: "departed", location: "Bharuch Jn" },
    { number: "19024", name: "FZR Janata Exp", status: "departed", location: "Vapi" },
  ];

  const WeatherIcon = weather === "clear" ? Sun : weather === "cloudy" ? Cloud : CloudRain;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary">
      {/* Header */}
      <div className="bg-navy text-white p-6 shadow-lg">
        <div className="container mx-auto">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center">
                <Train className="w-8 h-8 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-1">Controlling Railway Signals</h1>
                <p className="text-white/70 text-lg">Station Control & Train Monitoring</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Station Info Bar */}
      <div className="bg-muted border-b">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-1">Ahmedabad Junction</h2>
              <p className="text-muted-foreground text-lg">Station Code: ADI</p>
            </div>
            <div className="flex items-center gap-8">
              <div className="text-right">
                <p className="text-muted-foreground text-sm mb-1">Current Time</p>
                <p className="text-4xl font-bold text-foreground">
                  {currentTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
                </p>
              </div>
              <div className="flex items-center gap-3 bg-background rounded-xl p-4">
                <WeatherIcon className="w-8 h-8 text-orange" />
                <div>
                  <p className="text-2xl font-bold text-foreground">{temperature}°C</p>
                  <p className="text-muted-foreground text-sm capitalize">{weather}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Up Line - Approaching Trains */}
        <div className="mb-8">
          <div className="bg-green-100 dark:bg-green-950/30 rounded-t-xl px-6 py-4">
            <h3 className="text-2xl font-bold text-foreground flex items-center gap-3">
              <Navigation className="w-6 h-6 rotate-45" />
              Up Line - Approaching Trains
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {approachingTrains.map((train) => (
              <Card key={train.number} className="p-6 bg-card hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="text-3xl font-bold text-foreground mb-1">{train.number}</h4>
                    <p className="text-muted-foreground text-base">{train.name}</p>
                  </div>
                  <Badge className="bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/30">
                    approaching
                  </Badge>
                </div>
                <div className="border-t pt-4">
                  <p className="text-foreground font-semibold text-lg mb-1">{train.location}</p>
                  <p className="text-muted-foreground text-sm">{train.distance}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Down Line - Departed Trains */}
        <div>
          <div className="bg-blue-100 dark:bg-blue-950/30 rounded-t-xl px-6 py-4">
            <h3 className="text-2xl font-bold text-foreground flex items-center gap-3">
              <Navigation className="w-6 h-6 -rotate-[135deg]" />
              Down Line - Departed Trains
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {departedTrains.map((train) => (
              <Card key={train.number} className="p-6 bg-card hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="text-3xl font-bold text-foreground mb-1">{train.number}</h4>
                    <p className="text-muted-foreground text-base">{train.name}</p>
                  </div>
                  <Badge className="bg-blue-500/20 text-blue-700 dark:text-blue-400 border-blue-500/30">
                    departed
                  </Badge>
                </div>
                <div className="border-t pt-4">
                  <p className="text-foreground font-semibold text-lg mb-1">{train.location}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StationControl;
