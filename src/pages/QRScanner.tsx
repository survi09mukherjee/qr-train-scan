import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Html5Qrcode } from "html5-qrcode";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const QRScanner = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isScanning, setIsScanning] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const readerIdRef = useRef("qr-reader");

  useEffect(() => {
    startScanner();
    return () => {
      stopScanner();
    };
  }, []);

  const startScanner = async () => {
    try {
      const html5QrCode = new Html5Qrcode(readerIdRef.current);
      scannerRef.current = html5QrCode;

      await html5QrCode.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          handleScanSuccess(decodedText);
        },
        (errorMessage) => {
          // Ignore errors as they happen continuously while scanning
        }
      );
      setIsScanning(true);
    } catch (err) {
      console.error("Error starting scanner:", err);
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current && isScanning) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
      } catch (err) {
        console.error("Error stopping scanner:", err);
      }
    }
  };

  const handleScanSuccess = async (decodedText: string) => {
    console.log("QR Code scanned:", decodedText);
    await stopScanner();
    
    toast({
      title: "QR Code Scanned!",
      description: "Loading train details...",
    });

    // Navigate to train details with the scanned data
    navigate(`/train-details?code=${encodeURIComponent(decodedText)}`);
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
            <h1 className="text-3xl font-bold text-foreground">Scan QR Code</h1>
            <p className="text-muted-foreground">Point camera at train QR code</p>
          </div>
        </div>

        {/* Scanner Card */}
        <Card className="p-8 bg-card">
          <div className="flex flex-col items-center">
            <div id="qr-reader" className="w-full max-w-md rounded-xl overflow-hidden shadow-lg"></div>
            
            <div className="mt-6 text-center">
              <p className="text-muted-foreground mb-2">
                Position the QR code within the frame
              </p>
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
                <p className="text-sm font-medium text-foreground">Scanning...</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Instructions */}
        <Card className="mt-6 p-6 bg-primary">
          <h3 className="text-lg font-semibold text-primary-foreground mb-3">
            How to scan:
          </h3>
          <ul className="space-y-2 text-primary-foreground/90">
            <li className="flex items-start gap-2">
              <span className="text-accent font-bold">1.</span>
              <span>Find the QR code displayed on your train</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent font-bold">2.</span>
              <span>Hold your phone steady and center the QR code</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent font-bold">3.</span>
              <span>Wait for automatic detection and scanning</span>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default QRScanner;
