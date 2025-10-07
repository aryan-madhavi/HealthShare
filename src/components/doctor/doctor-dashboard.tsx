import React, { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Input } from "../ui/input";
import { 
  QrCode, 
  Stethoscope, 
  FileText, 
  Clock, 
  User, 
  Calendar,
  Search,
  Eye,
  Download,
  Plus,
  AlertCircle
} from "lucide-react";
import { useLanguage } from "../language-context";
import { useAuth } from "../auth-context";

interface PatientRecord {
  id: string;
  patientName: string;
  patientAge: number;
  recordType: string;
  title: string;
  date: string;
  doctor?: string;
  hospital?: string;
  accessGrantedAt: string;
  expiresAt: string;
  status: "active" | "expired";
}

interface RecentAccess {
  id: string;
  patientName: string;
  recordType: string;
  accessedAt: string;
  action: "viewed" | "downloaded";
}

export function DoctorDashboard() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("scan");
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data
  const patientRecords: PatientRecord[] = [
    {
      id: "1",
      patientName: "Ramesh Kumar",
      patientAge: 45,
      recordType: "Prescription",
      title: "Hypertension Medication",
      date: "2024-01-15",
      doctor: "Dr. Sharma",
      hospital: "AIIMS Delhi",
      accessGrantedAt: "2024-01-16T09:00:00Z",
      expiresAt: "2024-01-20T10:00:00Z",
      status: "active",
    },
    {
      id: "2",
      patientName: "Priya Singh",
      patientAge: 32,
      recordType: "Lab Report",
      title: "Blood Test Report",
      date: "2024-01-14",
      doctor: "Dr. Patel",
      hospital: "Max Hospital",
      accessGrantedAt: "2024-01-16T11:30:00Z",
      expiresAt: "2024-01-18T15:30:00Z",
      status: "active",
    },
  ];

  const recentAccess: RecentAccess[] = [
    {
      id: "1",
      patientName: "Ramesh Kumar",
      recordType: "Prescription",
      accessedAt: "2024-01-16T14:30:00Z",
      action: "viewed",
    },
    {
      id: "2",
      patientName: "Priya Singh",
      recordType: "Lab Report",
      accessedAt: "2024-01-16T13:15:00Z",
      action: "downloaded",
    },
  ];

  const getTimeRemaining = (expiresAt: string) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diffMs = expiry.getTime() - now.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMs <= 0) return t("time.expired");
    if (diffDays > 0) return `${diffDays} days`;
    if (diffHours > 0) return `${diffHours} hours`;
    return "< 1 hour";
  };

  const getRecordIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "prescription": return "💊";
      case "lab report": return "🧪";
      case "x-ray": return "🩻";
      case "discharge summary": return "📋";
      default: return "📄";
    }
  };

  const filteredRecords = patientRecords.filter(record =>
    record.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-secondary text-secondary-foreground p-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback>
                <Stethoscope className="w-5 h-5" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="font-semibold">Dr. {user?.name || "Doctor"}</h1>
              <div className="text-sm opacity-90">Cardiologist • AIIMS Delhi</div>
            </div>
          </div>
          <Badge variant="secondary" className="bg-white text-secondary">
            Verified Doctor
          </Badge>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="scan" className="flex items-center gap-2">
              <QrCode className="w-4 h-4" />
              {t("action.scan_qr")}
            </TabsTrigger>
            <TabsTrigger value="records" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Patient Records
            </TabsTrigger>
            <TabsTrigger value="recent" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Recent Access
            </TabsTrigger>
          </TabsList>

          {/* QR Scan Tab */}
          <TabsContent value="scan" className="space-y-6">
            <div className="text-center space-y-4">
              <h2>{t("doctor.scan_qr")}</h2>
              <p className="text-muted-foreground">
                Scan the QR code provided by your patient to access their health records
              </p>
            </div>

            <Card className="p-8">
              <CardContent className="text-center space-y-6">
                <div className="w-48 h-48 mx-auto border-2 border-dashed border-muted-foreground rounded-lg flex items-center justify-center">
                  <div className="space-y-4">
                    <QrCode className="w-16 h-16 text-muted-foreground mx-auto" />
                    <div className="text-muted-foreground">
                      Point your camera at the QR code
                    </div>
                  </div>
                </div>
                <Button className="bg-secondary hover:bg-secondary/90" size="lg">
                  <QrCode className="w-5 h-5 mr-2" />
                  Open Camera
                </Button>
              </CardContent>
            </Card>

            {/* Emergency Access Notice */}
            <Card className="bg-destructive/5 border-destructive/20">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-destructive mt-0.5" />
                  <div className="space-y-1">
                    <div className="font-medium text-destructive">Emergency Access</div>
                    <div className="text-sm text-muted-foreground">
                      In emergency situations, patients can generate special emergency QR codes with limited health summaries.
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Patient Records Tab */}
          <TabsContent value="records" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2>Accessible Patient Records</h2>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search patients or records..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 w-64"
                  />
                </div>
              </div>
            </div>

            <div className="grid gap-4">
              {filteredRecords.map((record) => (
                <Card key={record.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="text-2xl">{getRecordIcon(record.recordType)}</div>
                        <div className="space-y-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">{record.patientName}</h3>
                              <Badge variant="outline">{record.patientAge} years</Badge>
                            </div>
                            <div className="font-medium text-sm">{record.title}</div>
                          </div>
                          <div className="text-sm text-muted-foreground space-y-1">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              Record Date: {record.date}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              Access expires in: {getTimeRemaining(record.expiresAt)}
                            </div>
                            {record.doctor && (
                              <div className="flex items-center gap-1">
                                <User className="w-3 h-3" />
                                {record.doctor} • {record.hospital}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={record.status === "active" ? "default" : "secondary"}
                          className={record.status === "active" ? "bg-secondary text-secondary-foreground" : ""}
                        >
                          {t(`status.${record.status}`)}
                        </Badge>
                        <div className="flex gap-1">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {filteredRecords.length === 0 && (
                <Card className="p-8 text-center">
                  <CardContent className="space-y-4">
                    <FileText className="w-16 h-16 text-muted-foreground mx-auto" />
                    <div>
                      <h3 className="font-medium">No patient records available</h3>
                      <p className="text-muted-foreground">
                        {searchTerm ? "No records match your search" : "Scan patient QR codes to access their health records"}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Recent Access Tab */}
          <TabsContent value="recent" className="space-y-4">
            <h2>Recent Access History</h2>

            <div className="space-y-4">
              {recentAccess.map((access) => (
                <Card key={access.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-xl">{getRecordIcon(access.recordType)}</div>
                        <div>
                          <div className="font-medium">{access.patientName}</div>
                          <div className="text-sm text-muted-foreground">
                            {access.recordType} • {access.action}
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(access.accessedAt).toLocaleString()}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {recentAccess.length === 0 && (
                <Card className="p-8 text-center">
                  <CardContent className="space-y-4">
                    <Clock className="w-16 h-16 text-muted-foreground mx-auto" />
                    <div>
                      <h3 className="font-medium">No recent access</h3>
                      <p className="text-muted-foreground">Your recent patient record access history will appear here</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}