import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";
import { ArrowLeft, Upload, CheckCircle, XCircle, Camera, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const QRScanner = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<{ status: 'success' | 'error' | null, message?: string }>({ status: null });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const readerIdRef = useRef("qr-reader");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      startScanner();
    }, 500);

    return () => {
      mountedRef.current = false;
      clearTimeout(timer);
      stopScanner();
    };
  }, []);

  const startScanner = async () => {
    setErrorMessage(null);
    try {
      // Check if camera is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera not supported or permission denied. Please ensure you are using HTTPS.");
      }

      if (scannerRef.current) {
        // Already instance exists, try to stop it first just in case
        await stopScanner();
      }

      const html5QrCode = new Html5Qrcode(readerIdRef.current);
      scannerRef.current = html5QrCode;

      const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
        formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE]
      };

      await html5QrCode.start(
        { facingMode: "environment" },
        config,
        (decodedText) => {
          if (mountedRef.current) {
            handleScanSuccess(decodedText);
          }
        },
        (errorMessage) => {
          // Ignore frame parse errors
        }
      );

      if (mountedRef.current) {
        setIsScanning(true);
      }
    } catch (err: any) {
      console.error("Error starting scanner:", err);
      if (mountedRef.current) {
        setErrorMessage(err.message || "Failed to start camera.");
        toast({
          title: "Camera Error",
          description: err.message || "Unable to access camera.",
          variant: "destructive",
        });
      }
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current) {
      try {
        if (scannerRef.current.isScanning) {
          await scannerRef.current.stop();
        }
        scannerRef.current.clear();
      } catch (err) {
        console.error("Error stopping scanner:", err);
      }
      scannerRef.current = null;
      if (mountedRef.current) {
        setIsScanning(false);
      }
    }
  };

  const handleScanSuccess = async (decodedText: string) => {
    await stopScanner();

    toast({
      title: "Scan Successful",
      description: "Redirecting to live train status...",
      duration: 2000,
    });

    // Extract train ID (assuming alphanumeric only for simplicity)
    const trainId = decodedText.replace(/[^a-zA-Z0-9]/g, "") || "12345";

    setTimeout(() => {
      if (mountedRef.current) {
        navigate(`/train/${trainId}`);
      }
    }, 1000);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Create a temporary scanner for file if main one isn't running or to avoid conflict
    // But html5-qrcode can scan file without instance if using static method, 
    // OR we can use the existing instance if it's not scanning.
    // Safest is to use a new instance or the existing one.

    try {
      const html5QrCode = new Html5Qrcode(readerIdRef.current);
      const decodedText = await html5QrCode.scanFile(file, true);
      handleScanSuccess(decodedText);
    } catch (err) {
      console.error("Error scanning file:", err);
      setScanResult({ status: 'error', message: "Could not read QR code from image." });
    }
  };

  const resetScan = () => {
    setScanResult({ status: null });
    startScanner();
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="container max-w-md mx-auto px-4 py-6 flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="rounded-full"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Scan QR</h1>
            <p className="text-muted-foreground text-sm">Check-in or verify session</p>
          </div>
        </div>

        {/* Scanner Area */}
        <Card className="flex-1 overflow-hidden relative bg-black rounded-3xl border-0 shadow-2xl flex flex-col justify-center">
          {errorMessage ? (
            <div className="p-6 text-center">
              <Alert variant="destructive" className="mb-4 bg-red-900/20 border-red-900/50 text-red-200">
                <XCircle className="h-4 w-4" />
                <AlertTitle>Camera Error</AlertTitle>
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
              <Button onClick={() => startScanner()} variant="outline" className="gap-2">
                <RefreshCw className="w-4 h-4" /> Retry Camera
              </Button>
            </div>
          ) : (
            <>
              <div id="qr-reader" className="w-full h-full bg-black"></div>

              {/* Overlay UI - Only show if scanning */}
              {isScanning && (
                <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
                  <div className="w-64 h-64 border-2 border-white/50 rounded-3xl relative">
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-xl"></div>
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-xl"></div>
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-xl"></div>
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-xl"></div>
                  </div>
                  <p className="mt-8 text-white/80 font-medium bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm">
                    Align QR code within frame
                  </p>
                </div>
              )}
            </>
          )}
        </Card>

        {/* Controls */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <Button
            variant="outline"
            className="h-14 flex flex-col gap-1"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-5 w-5" />
            <span className="text-xs">Upload Image</span>
          </Button>
          <Input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileUpload}
          />

          <Button
            variant="outline"
            className="h-14 flex flex-col gap-1"
            onClick={() => {
              stopScanner().then(() => startScanner());
            }}
          >
            <Camera className="h-5 w-5" />
            <span className="text-xs">Switch Camera</span>
          </Button>
        </div>

        {/* Result Dialog */}
        <Dialog open={!!scanResult.status} onOpenChange={(open) => !open && resetScan()}>
          <DialogContent className="sm:max-w-md text-center">
            <DialogHeader>
              <div className="mx-auto mb-4">
                {scanResult.status === 'success' ? (
                  <CheckCircle className="h-16 w-16 text-green-500" />
                ) : (
                  <XCircle className="h-16 w-16 text-red-500" />
                )}
              </div>
              <DialogTitle className="text-center text-xl">
                {scanResult.status === 'success' ? 'Scan Successful' : 'Scan Failed'}
              </DialogTitle>
              <DialogDescription className="text-center">
                {scanResult.message}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="sm:justify-center">
              <Button onClick={resetScan} className="w-full sm:w-auto">
                {scanResult.status === 'success' ? 'Scan Another' : 'Try Again'}
              </Button>
              {scanResult.status === 'success' && (
                <Button variant="secondary" onClick={() => navigate('/dashboard')} className="w-full sm:w-auto">
                  Done
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default QRScanner;
