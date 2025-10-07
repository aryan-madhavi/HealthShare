import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { ArrowLeft, Smartphone, Shield, User, Stethoscope, Building2, Heart, FileText, Users } from "lucide-react";
import { useLanguage } from "../language-context";
import { useAuth, type UserRole } from "../auth-context";

interface AuthScreenProps {
  onBack: () => void;
}

const roleIcons = {
  patient: User,
  doctor: Stethoscope,
  lab: Building2,
  hospital: Building2,
  insurance: Shield,
  regulator: FileText,
  caregiver: Users,
};

const roleColors = {
  patient: "bg-primary text-primary-foreground",
  doctor: "bg-secondary text-secondary-foreground",
  lab: "bg-chart-4 text-white",
  hospital: "bg-primary text-primary-foreground",
  insurance: "bg-chart-5 text-white",
  regulator: "bg-destructive text-destructive-foreground",
  caregiver: "bg-chart-2 text-white",
};

export function AuthScreen({ onBack }: AuthScreenProps) {
  const { t } = useLanguage();
  const { login } = useAuth();
  const [step, setStep] = useState<"mobile" | "otp" | "role">("mobile");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  const handleMobileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mobile.length === 10) {
      setStep("otp");
    }
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length === 6) {
      setStep("role");
    }
  };

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
  };

  const handleComplete = () => {
    if (selectedRole) {
      login({
        id: "user-123",
        name: "User Name",
        mobile,
        role: selectedRole,
        verified: true,
      });
    }
  };

  const roles: { key: UserRole; name: string; description: string }[] = [
    { key: "patient", name: t("role.patient"), description: "Upload and manage your health records" },
    { key: "doctor", name: t("role.doctor"), description: "Access patient records with consent" },
    { key: "lab", name: t("role.lab"), description: "View prescriptions and lab reports" },
    { key: "hospital", name: t("role.hospital"), description: "Manage hospital staff and compliance" },
    { key: "insurance", name: t("role.insurance"), description: "Access claims-related data only" },
    { key: "regulator", name: t("role.regulator"), description: "Audit and compliance monitoring" },
    { key: "caregiver", name: t("role.caregiver"), description: "Manage family member records" },
  ];

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-primary" />
            <span className="font-semibold text-primary">{t("app.title")}</span>
          </div>
        </div>

        {/* Mobile Number Step */}
        {step === "mobile" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="w-5 h-5" />
                {t("auth.mobile")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleMobileSubmit} className="space-y-4">
                <div>
                  <Input
                    type="tel"
                    placeholder={t("auth.mobile.placeholder")}
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    maxLength={10}
                    className="text-lg"
                  />
                  <div className="text-sm text-muted-foreground mt-2">
                    We'll send you a 6-digit OTP for verification
                  </div>
                </div>
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={mobile.length !== 10}
                >
                  {t("continue")}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* OTP Step */}
        {step === "otp" && (
          <Card>
            <CardHeader>
              <CardTitle>{t("auth.otp")}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleOtpSubmit} className="space-y-4">
                <div>
                  <Input
                    type="text"
                    placeholder={t("auth.otp.placeholder")}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                    className="text-lg text-center"
                  />
                  <div className="text-sm text-muted-foreground mt-2">
                    OTP sent to +91 {mobile}
                  </div>
                </div>
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={otp.length !== 6}
                >
                  {t("continue")}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Role Selection Step */}
        {step === "role" && (
          <Card>
            <CardHeader>
              <CardTitle>{t("auth.role.select")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3">
                {roles.map((role) => {
                  const Icon = roleIcons[role.key];
                  const isSelected = selectedRole === role.key;
                  
                  return (
                    <div
                      key={role.key}
                      onClick={() => handleRoleSelect(role.key)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        isSelected 
                          ? "border-primary bg-accent" 
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${roleColors[role.key]}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{role.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {role.description}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <Button 
                onClick={handleComplete}
                className="w-full" 
                disabled={!selectedRole}
              >
                {t("continue")}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}