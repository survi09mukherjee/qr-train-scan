import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const PNRStatus = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [pnrNumber, setPnrNumber] = useState("");

  const handleSearch = () => {
    if (pnrNumber.length !== 10) {
      toast({
        title: "Invalid PNR",
        description: "PNR number must be 10 digits",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Searching...",
      description: "Fetching PNR status",
    });

    // In a real app, this would call an API
    setTimeout(() => {
      toast({
        title: "PNR Found",
        description: "Status: Confirmed",
      });
    }, 1500);
  };

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
            <h1 className="text-3xl font-bold text-foreground">PNR Status</h1>
            <p className="text-muted-foreground">Check your ticket status</p>
          </div>
        </div>

        {/* Search Card */}
        <Card className="p-8 bg-card">
          <div className="mb-6">
            <label className="block text-sm font-medium text-card-foreground mb-2">
              Enter 10-digit PNR Number
            </label>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="1234567890"
                value={pnrNumber}
                onChange={(e) => setPnrNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
                className="text-lg"
                maxLength={10}
              />
              <Button 
                onClick={handleSearch}
                className="bg-primary hover:bg-primary/90 px-6"
              >
                <Search className="w-5 h-5 mr-2" />
                Search
              </Button>
            </div>
          </div>

          <div className="border-t border-border pt-6">
            <h3 className="font-semibold text-card-foreground mb-3">What you can check:</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-accent rounded-full"></div>
                <span>Current booking status</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-accent rounded-full"></div>
                <span>Coach and seat number</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-accent rounded-full"></div>
                <span>Train schedule and timing</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-accent rounded-full"></div>
                <span>Passenger details</span>
              </li>
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PNRStatus;
