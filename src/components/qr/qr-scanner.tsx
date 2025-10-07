import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { QrCode, Camera, AlertTriangle, CheckCircle, Clock, User } from "lucide-react";
import { useLanguage } from "../language-context";

interface QRScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (data: any) => void;
}

interface ScannedData {
  patientName: string;
  patientAge: number;
  recordType: string;
  expiresAt: string;
  isEmergency: boolean;
  accessLevel: string;
}

export function QRScanner({ isOpen, onClose, onSuccess }: QRScannerProps) {
  const { t } = useLanguage();
  const [scanning, setScanning] = useState(false);
  const [scannedData, setScannedData] = useState<ScannedData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const mockScanData: ScannedData = {
    patientName: "Ramesh Kumar",
    patientAge: 45,
    recordType: "Medical Records",
    expiresAt: "2024-01-20T10:00:00Z",
    isEmergency: false,
    accessLevel: "full",
  };

  const mockEmergencyData: ScannedData = {
    patientName: "Emergency Patient",
    patientAge: 0,
    recordType: "Emergency Access",
    expiresAt: "2024-01-16T16:00:00Z",
    isEmergency: true,
    accessLevel: "emergency",
  };

  const handleStartScan = () => {
    setScanning(true);
    setError(null);
    
    // Simulate QR scan after 2 seconds
    setTimeout(() => {
      setScanning(false);
      // Randomly decide between normal and emergency scan
      const isEmergency = Math.random() > 0.7;
      const data = isEmergency ? mockEmergencyData : mockScanData;
      setScannedData(data);
    }, 2000);
  };

  const handleAccess = () => {
    if (scannedData && onSuccess) {
      onSuccess(scannedData);
    }
    onClose();
  };

  const getTimeRemaining = (expiresAt: string) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diffMs = expiry.getTime() - now.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffMs <= 0) return "Expired";
    if (diffHours > 0) return `${diffHours}h ${diffMinutes}m`;
    return `${diffMinutes}m`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <QrCode className="w-5 h-5" />
            {t("action.scan_qr")}
          </DialogTitle>
          <DialogDescription>
            {!scanning && !scannedData && !error && "Position the patient's QR code within the camera frame to access their health records securely."}
            {scanning && "Scanning QR code, please keep the code steady within the frame."}
            {scannedData && !scannedData.isEmergency && "QR code verified successfully. You can now access the patient's health records."}
            {scannedData && scannedData.isEmergency && "Emergency QR code detected. Limited access to critical health information only."}
            {error && "QR code scanning failed. Please try again or ask the patient for a new QR code."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {!scanning && !scannedData && !error && (
            <>
              {/* Scanner Interface */}
              <Card>
                <CardContent className="p-6 text-center space-y-4">
                  <div className="w-48 h-48 mx-auto border-2 border-dashed border-muted-foreground rounded-lg flex items-center justify-center">
                    <div className="space-y-4">
                      <QrCode className="w-16 h-16 text-muted-foreground mx-auto" />
                      <div className="text-muted-foreground">
                        Position QR code within the frame
                      </div>
                    </div>
                  </div>
                  <Button onClick={handleStartScan} className="w-full" size="lg">
                    <Camera className="w-5 h-5 mr-2" />
                    Start Camera
                  </Button>
                </CardContent>
              </Card>

              {/* Instructions */}
              <div className="text-sm text-muted-foreground space-y-2">
                <div className="font-medium">How to scan:</div>
                <ul className="space-y-1 ml-4">
                  <li>• Ask the patient to show their HealthLock QR code</li>
                  <li>• Point your camera at the QR code</li>
                  <li>• Keep the code within the frame</li>
                  <li>• Wait for automatic recognition</li>
                </ul>
              </div>
            </>
          )}

          {scanning && (
            <Card>
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto animate-pulse">
                  <Camera className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <div className="font-medium">Scanning QR Code...</div>
                  <div className="text-sm text-muted-foreground">Keep the QR code steady</div>
                </div>
              </CardContent>
            </Card>
          )}

          {scannedData && (
            <>
              {/* Scanned Data */}
              <Card className={scannedData.isEmergency ? "bg-destructive/5 border-destructive/20" : ""}>
                <CardContent className="p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle className={`w-5 h-5 ${scannedData.isEmergency ? 'text-destructive' : 'text-secondary'}`} />
                      <div className="font-medium">
                        {scannedData.isEmergency ? "Emergency Access" : "QR Code Verified"}
                      </div>
                    </div>
                    <Badge 
                      variant={scannedData.isEmergency ? "destructive" : "default"}
                      className={scannedData.isEmergency ? "" : "bg-secondary text-secondary-foreground"}
                    >
                      {scannedData.isEmergency ? "EMERGENCY" : "ACTIVE"}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    {!scannedData.isEmergency && (
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span>{scannedData.patientName}, {scannedData.patientAge} years</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span>Expires in {getTimeRemaining(scannedData.expiresAt)}</span>
                    </div>
                  </div>

                  {scannedData.isEmergency && (
                    <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg">
                      <div className="font-medium">Emergency Access Granted</div>
                      <div>Limited to critical health information only</div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Access Button */}
              <Button 
                onClick={handleAccess}
                className={`w-full ${scannedData.isEmergency ? 'bg-destructive hover:bg-destructive/90' : 'bg-secondary hover:bg-secondary/90'}`}
                size="lg"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                {scannedData.isEmergency ? "Access Emergency Records" : "Access Patient Records"}
              </Button>
            </>
          )}

          {error && (
            <Card className="bg-destructive/5 border-destructive/20">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-destructive mt-0.5" />
                  <div>
                    <div className="font-medium text-destructive">Scan Failed</div>
                    <div className="text-sm text-muted-foreground">{error}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Close Button */}
          <Button variant="outline" onClick={onClose} className="w-full">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}