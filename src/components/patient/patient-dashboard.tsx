import React, { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { 
  Upload, 
  QrCode, 
  History, 
  AlertTriangle, 
  Users, 
  FileText, 
  Shield, 
  Clock,
  Eye,
  RotateCcw,
  Plus
} from "lucide-react";
import { useLanguage } from "../language-context";
import { useAuth } from "../auth-context";
import { UploadRecordModal } from "./upload-record-modal";
import { EmergencyModal } from "../shared/emergency-modal";

interface HealthRecord {
  id: string;
  type: "prescription" | "lab_report" | "xray" | "discharge_summary";
  title: string;
  date: string;
  doctor?: string;
  hospital?: string;
  encrypted: boolean;
}

interface ActiveShare {
  id: string;
  recordId: string;
  recipientRole: string;
  recipientName: string;
  expiresAt: string;
  accessCount: number;
  status: "active" | "expired" | "revoked";
}

interface AuditEntry {
  id: string;
  recordId: string;
  accessedBy: string;
  accessedAt: string;
  action: "viewed" | "downloaded" | "shared";
  recipientRole: string;
}

export function PatientDashboard() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("records");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [records, setRecords] = useState<HealthRecord[]>([
    {
      id: "1",
      type: "prescription",
      title: "Hypertension Medication",
      date: "2024-01-15",
      doctor: "Dr. Sharma",
      hospital: "AIIMS Delhi",
      encrypted: true,
    },
    {
      id: "2",
      type: "lab_report",
      title: "Blood Test Report",
      date: "2024-01-10",
      doctor: "Dr. Patel",
      hospital: "Max Hospital",
      encrypted: true,
    },
  ]);

  const activeShares: ActiveShare[] = [
    {
      id: "1",
      recordId: "1",
      recipientRole: "Doctor",
      recipientName: "Dr. Kumar",
      expiresAt: "2024-01-20T10:00:00Z",
      accessCount: 3,
      status: "active",
    },
    {
      id: "2",
      recordId: "2",
      recipientRole: "Insurance",
      recipientName: "LIC Health",
      expiresAt: "2024-01-18T15:30:00Z",
      accessCount: 1,
      status: "active",
    },
  ];

  const auditEntries: AuditEntry[] = [
    {
      id: "1",
      recordId: "1",
      accessedBy: "Dr. Kumar",
      accessedAt: "2024-01-16T14:30:00Z",
      action: "viewed",
      recipientRole: "Doctor",
    },
    {
      id: "2",
      recordId: "2",
      accessedBy: "LIC Health",
      accessedAt: "2024-01-16T09:15:00Z",
      action: "viewed",
      recipientRole: "Insurance",
    },
  ];

  const getTimeRemaining = (expiresAt: string) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diffMs = expiry.getTime() - now.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMs <= 0) return t("time.expired");
    if (diffDays > 0) return `${diffDays} ${t("time.days_ago")}`;
    if (diffHours > 0) return `${diffHours} ${t("time.hours_ago")}`;
    return t("time.just_now");
  };

  const getRecordIcon = (type: string) => {
    switch (type) {
      case "prescription": return "💊";
      case "lab_report": return "🧪";
      case "xray": return "🩻";
      case "discharge_summary": return "📋";
      default: return "📄";
    }
  };

  const handleUploadComplete = (newRecord: any) => {
    setRecords(prev => [newRecord, ...prev]);
  };

  const handleEmergencyAccess = () => {
    setShowEmergencyModal(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="font-semibold">{user?.name || "User"}</h1>
              <div className="text-sm opacity-90">+91 {user?.mobile}</div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={handleEmergencyAccess}>
              <AlertTriangle className="w-4 h-4 mr-2" />
              {t("emergency")}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="records" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Records
            </TabsTrigger>
            <TabsTrigger value="shares" className="flex items-center gap-2">
              <QrCode className="w-4 h-4" />
              Active Shares
            </TabsTrigger>
            <TabsTrigger value="audit" className="flex items-center gap-2">
              <History className="w-4 h-4" />
              Audit Trail
            </TabsTrigger>
            <TabsTrigger value="family" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Family
            </TabsTrigger>
          </TabsList>

          {/* Records Tab */}
          <TabsContent value="records" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2>{t("patient.dashboard")}</h2>
              <Button 
                className="bg-primary hover:bg-primary/90"
                onClick={() => setShowUploadModal(true)}
              >
                <Upload className="w-4 h-4 mr-2" />
                {t("patient.upload_record")}
              </Button>
            </div>

            {records.length === 0 ? (
              <Card className="p-8 text-center">
                <CardContent className="space-y-4">
                  <FileText className="w-16 h-16 text-muted-foreground mx-auto" />
                  <div>
                    <h3 className="font-medium">{t("patient.no_records")}</h3>
                    <p className="text-muted-foreground">{t("patient.upload_first")}</p>
                  </div>
                  <Button 
                    className="bg-primary hover:bg-primary/90"
                    onClick={() => setShowUploadModal(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    {t("patient.upload_record")}
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {records.map((record) => (
                  <Card key={record.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className="text-2xl">{getRecordIcon(record.type)}</div>
                          <div>
                            <h3 className="font-medium">{record.title}</h3>
                            <div className="text-sm text-muted-foreground space-y-1">
                              <div>{record.date}</div>
                              {record.doctor && <div>{record.doctor}</div>}
                              {record.hospital && <div>{record.hospital}</div>}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {record.encrypted && (
                            <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
                              <Shield className="w-3 h-3 mr-1" />
                              Encrypted
                            </Badge>
                          )}
                          <Button variant="outline" size="sm">
                            <QrCode className="w-4 h-4 mr-2" />
                            {t("share")}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Active Shares Tab */}
          <TabsContent value="shares" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2>{t("patient.active_shares")}</h2>
              <Button variant="destructive">
                <RotateCcw className="w-4 h-4 mr-2" />
                {t("action.revoke_all")}
              </Button>
            </div>

            <div className="grid gap-4">
              {activeShares.map((share) => (
                <Card key={share.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{share.recipientRole}</Badge>
                          <span className="font-medium">{share.recipientName}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            Accessed {share.accessCount} times
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            <Clock className="w-3 h-3" />
                            {t("time.expires_in")} {getTimeRemaining(share.expiresAt)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={share.status === "active" ? "default" : "secondary"}
                          className={share.status === "active" ? "bg-secondary text-secondary-foreground" : ""}
                        >
                          {t(`status.${share.status}`)}
                        </Badge>
                        <Button variant="destructive" size="sm">
                          {t("revoke")}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Audit Tab */}
          <TabsContent value="audit" className="space-y-4">
            <h2>{t("patient.audit_trail")}</h2>

            <div className="space-y-4">
              {auditEntries.map((entry) => (
                <Card key={entry.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{entry.recipientRole}</Badge>
                          <span className="font-medium">{entry.accessedBy}</span>
                          <span className="text-muted-foreground">{entry.action} your record</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(entry.accessedAt).toLocaleString()}
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Family Tab */}
          <TabsContent value="family" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2>{t("patient.family_accounts")}</h2>
              <Button variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Add Family Member
              </Button>
            </div>

            <Card className="p-8 text-center">
              <CardContent className="space-y-4">
                <Users className="w-16 h-16 text-muted-foreground mx-auto" />
                <div>
                  <h3 className="font-medium">No family members added</h3>
                  <p className="text-muted-foreground">Add family members to manage their health records</p>
                </div>
                <Button variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Family Member
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modals */}
      <UploadRecordModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUploadComplete={handleUploadComplete}
      />
      
      <EmergencyModal
        isOpen={showEmergencyModal}
        onClose={() => setShowEmergencyModal(false)}
      />
    </div>
  );
}