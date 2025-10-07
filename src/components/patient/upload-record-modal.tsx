import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { 
  Upload, 
  FileText, 
  Image, 
  Shield, 
  Lock, 
  CheckCircle, 
  X,
  Calendar,
  User,
  Building2,
  AlertCircle
} from "lucide-react";
import { useLanguage } from "../language-context";

interface UploadRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadComplete?: (record: any) => void;
}

interface UploadedFile {
  file: File;
  id: string;
  type: string;
}

export function UploadRecordModal({ isOpen, onClose, onUploadComplete }: UploadRecordModalProps) {
  const { t } = useLanguage();
  const [step, setStep] = useState<"upload" | "metadata" | "encrypting" | "complete">("upload");
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  // Metadata form
  const [recordType, setRecordType] = useState("");
  const [title, setTitle] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [hospitalName, setHospitalName] = useState("");
  const [recordDate, setRecordDate] = useState("");
  const [notes, setNotes] = useState("");

  const recordTypes = [
    { value: "prescription", label: t("record.prescription"), icon: "💊" },
    { value: "lab_report", label: t("record.lab_report"), icon: "🧪" },
    { value: "xray", label: t("record.xray"), icon: "🩻" },
    { value: "mri", label: t("record.mri"), icon: "🧠" },
    { value: "ct_scan", label: t("record.ct_scan"), icon: "📱" },
    { value: "blood_test", label: t("record.blood_test"), icon: "🩸" },
    { value: "discharge_summary", label: t("record.discharge_summary"), icon: "📋" },
  ];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = (fileList: File[]) => {
    const validFiles = fileList.filter(file => {
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
      return validTypes.includes(file.type) && file.size <= 10 * 1024 * 1024; // 10MB limit
    });

    const newFiles: UploadedFile[] = validFiles.map(file => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      type: file.type.includes('image') ? 'image' : 'pdf'
    }));

    setFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (id: string) => {
    setFiles(files.filter(file => file.id !== id));
  };

  const handleNext = () => {
    if (step === "upload" && files.length > 0) {
      setStep("metadata");
    } else if (step === "metadata" && recordType && title) {
      setStep("encrypting");
      simulateEncryption();
    }
  };

  const simulateEncryption = () => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 20;
      setUploadProgress(Math.min(progress, 100));
      
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setStep("complete");
        }, 500);
      }
    }, 200);
  };

  const handleComplete = () => {
    const newRecord = {
      id: Math.random().toString(36).substr(2, 9),
      type: recordType,
      title,
      date: recordDate || new Date().toISOString().split('T')[0],
      doctor: doctorName,
      hospital: hospitalName,
      notes,
      files: files.length,
      encrypted: true,
      uploadedAt: new Date().toISOString(),
    };

    if (onUploadComplete) {
      onUploadComplete(newRecord);
    }
    
    handleClose();
  };

  const handleClose = () => {
    setStep("upload");
    setFiles([]);
    setUploadProgress(0);
    setRecordType("");
    setTitle("");
    setDoctorName("");
    setHospitalName("");
    setRecordDate("");
    setNotes("");
    onClose();
  };

  const getFileIcon = (type: string) => {
    return type === 'image' ? <Image className="w-4 h-4" /> : <FileText className="w-4 h-4" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            {t("patient.upload_record")}
          </DialogTitle>
          <DialogDescription>
            {step === "upload" && "Upload your medical records securely. Supported formats: PDF, JPG, PNG (Max 10MB each)"}
            {step === "metadata" && "Add details about your medical record for easy identification and sharing"}
            {step === "encrypting" && "Securing your data with end-to-end encryption"}
            {step === "complete" && "Your health record has been encrypted and stored securely"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Upload Step */}
          {step === "upload" && (
            <div className="space-y-4">
              {/* Drag & Drop Area */}
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive 
                    ? "border-primary bg-accent" 
                    : "border-border hover:border-primary/50"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto">
                    <Upload className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">Drag and drop files here</div>
                    <div className="text-sm text-muted-foreground">or click to browse</div>
                  </div>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileInput}
                    className="hidden"
                    id="file-upload"
                  />
                  <Button 
                    variant="outline" 
                    onClick={() => document.getElementById('file-upload')?.click()}
                  >
                    Choose Files
                  </Button>
                </div>
              </div>

              {/* Uploaded Files */}
              {files.length > 0 && (
                <div className="space-y-2">
                  <div className="font-medium">Uploaded Files ({files.length})</div>
                  {files.map((uploadedFile) => (
                    <Card key={uploadedFile.id}>
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {getFileIcon(uploadedFile.type)}
                            <div>
                              <div className="font-medium text-sm">{uploadedFile.file.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {formatFileSize(uploadedFile.file.size)}
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(uploadedFile.id)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              <div className="flex justify-between">
                <Button variant="outline" onClick={handleClose}>
                  {t("cancel")}
                </Button>
                <Button 
                  onClick={handleNext}
                  disabled={files.length === 0}
                  className="bg-primary hover:bg-primary/90"
                >
                  {t("next")}
                </Button>
              </div>
            </div>
          )}

          {/* Metadata Step */}
          {step === "metadata" && (
            <div className="space-y-4">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="record-type">Record Type *</Label>
                  <Select value={recordType} onValueChange={setRecordType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select record type" />
                    </SelectTrigger>
                    <SelectContent>
                      {recordTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center gap-2">
                            <span>{type.icon}</span>
                            <span>{type.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Title/Description *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Blood Test Report, X-Ray Results"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="doctor">Doctor Name</Label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="doctor"
                        placeholder="Dr. Name"
                        value={doctorName}
                        onChange={(e) => setDoctorName(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hospital">Hospital/Clinic</Label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="hospital"
                        placeholder="Hospital name"
                        value={hospitalName}
                        onChange={(e) => setHospitalName(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date">Record Date</Label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="date"
                      type="date"
                      value={recordDate}
                      onChange={(e) => setRecordDate(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any additional information or context"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep("upload")}>
                  {t("back")}
                </Button>
                <Button 
                  onClick={handleNext}
                  disabled={!recordType || !title}
                  className="bg-primary hover:bg-primary/90"
                >
                  {t("upload")} & Encrypt
                </Button>
              </div>
            </div>
          )}

          {/* Encrypting Step */}
          {step === "encrypting" && (
            <div className="space-y-6 text-center">
              <div className="space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto animate-pulse">
                  <Lock className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Encrypting Your Health Record</h3>
                  <p className="text-sm text-muted-foreground">
                    Securing your data with end-to-end encryption
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Progress value={uploadProgress} className="w-full" />
                <div className="text-sm text-muted-foreground">
                  {Math.round(uploadProgress)}% complete
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-secondary" />
                  <span>Uploaded</span>
                </div>
                <div className="flex items-center gap-1">
                  <Lock className="w-3 h-3 text-primary" />
                  <span>Encrypting</span>
                </div>
                <div className="flex items-center gap-1">
                  <Shield className="w-3 h-3 text-muted-foreground" />
                  <span>Securing</span>
                </div>
              </div>
            </div>
          )}

          {/* Complete Step */}
          {step === "complete" && (
            <div className="space-y-6 text-center">
              <div className="space-y-4">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8 text-secondary" />
                </div>
                <div>
                  <h3 className="font-medium">Record Uploaded Successfully!</h3>
                  <p className="text-sm text-muted-foreground">
                    Your health record has been encrypted and stored securely
                  </p>
                </div>
              </div>

              <Card className="p-4 text-left">
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{title}</span>
                    <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
                      <Shield className="w-3 h-3 mr-1" />
                      Encrypted
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <div>Type: {recordTypes.find(t => t.value === recordType)?.label}</div>
                    <div>Files: {files.length} uploaded</div>
                    {doctorName && <div>Doctor: {doctorName}</div>}
                    {hospitalName && <div>Hospital: {hospitalName}</div>}
                  </div>
                </CardContent>
              </Card>

              <div className="bg-accent/50 p-4 rounded-lg text-sm">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-primary mt-0.5" />
                  <div className="text-left">
                    <div className="font-medium">Next Steps:</div>
                    <div className="text-muted-foreground">
                      You can now share this record with healthcare providers using QR codes or manage access from your dashboard.
                    </div>
                  </div>
                </div>
              </div>

              <Button 
                onClick={handleComplete}
                className="w-full bg-secondary hover:bg-secondary/90"
                size="lg"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Complete
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}