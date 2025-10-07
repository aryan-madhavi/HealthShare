import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { AlertTriangle, Clock, QrCode, Copy, CheckCircle } from "lucide-react";
import { useLanguage } from "../language-context";

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EmergencyModal({ isOpen, onClose }: EmergencyModalProps) {
  const { t } = useLanguage();
  const [qrGenerated, setQrGenerated] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerateEmergencyQR = () => {
    setQrGenerated(true);
    
    // Auto-expire after 1 hour
    setTimeout(() => {
      setQrGenerated(false);
      onClose();
    }, 3600000); // 1 hour
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText("EMERGENCY-QR-CODE-123456");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="w-5 h-5" />
            Emergency Access
          </DialogTitle>
          <DialogDescription>
            {!qrGenerated 
              ? "Generate an emergency QR code for critical health information access during medical emergencies."
              : "Emergency QR code generated successfully. Share only with authorized medical personnel."
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {!qrGenerated ? (
            <>
              {/* Warning */}
              <Card className="bg-destructive/5 border-destructive/20">
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="font-medium text-destructive">Emergency Use Only</div>
                    <div className="text-sm text-muted-foreground">
                      This will generate a special QR code that provides limited access to your critical health information for emergency medical care.
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* What's Included */}
              <div className="space-y-2">
                <div className="font-medium">Emergency information includes:</div>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                  <li>• Blood type and allergies</li>
                  <li>• Current medications</li>
                  <li>• Critical medical conditions</li>
                  <li>• Emergency contact details</li>
                </ul>
              </div>

              {/* Duration */}
              <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <div className="text-sm">
                  <div className="font-medium">Auto-expires in 1 hour</div>
                  <div className="text-muted-foreground">Access will be automatically revoked</div>
                </div>
              </div>

              {/* Generate Button */}
              <Button 
                onClick={handleGenerateEmergencyQR}
                className="w-full bg-destructive"
                size="lg"
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                Generate Emergency QR Code
              </Button>
            </>
          ) : (
            <>
              {/* Success State */}
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8 text-destructive" />
                </div>
                <div>
                  <div className="font-medium text-destructive">Emergency QR Generated</div>
                  <div className="text-sm text-muted-foreground">Share this with emergency medical personnel only</div>
                </div>
              </div>

              {/* QR Code Placeholder */}
              <Card className="bg-destructive/5 border-destructive/20">
                <CardContent className="p-6 text-center">
                  <div className="w-32 h-32 bg-white border-2 border-destructive rounded-lg flex items-center justify-center mx-auto mb-4">
                    <QrCode className="w-16 h-16 text-destructive" />
                  </div>
                  <Badge variant="destructive" className="mb-2">
                    EMERGENCY ACCESS
                  </Badge>
                  <div className="text-sm text-muted-foreground">
                    Valid for 1 hour only
                  </div>
                </CardContent>
              </Card>

              {/* Emergency Code */}
              <div className="space-y-2">
                <div className="font-medium">Emergency Access Code:</div>
                <div className="flex items-center gap-2">
                  <code className="flex-1 p-2 bg-muted rounded text-sm font-mono">
                    EMERGENCY-QR-123456
                  </code>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleCopyCode}
                  >
                    {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            </>
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