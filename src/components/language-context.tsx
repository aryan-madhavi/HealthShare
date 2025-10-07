import React, { createContext, useContext, useState } from "react";

type Language = "en" | "hi";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    // General
    "app.title": "HealthLock",
    "app.tagline": "Encrypt. Share. Revoke. Trust.",
    "language.toggle": "हिंदी",
    "continue": "Continue",
    "back": "Back",
    "next": "Next",
    "save": "Save",
    "cancel": "Cancel",
    "delete": "Delete",
    "edit": "Edit",
    "view": "View",
    "share": "Share",
    "revoke": "Revoke",
    "upload": "Upload",
    "download": "Download",
    "scan": "Scan QR",
    "emergency": "Emergency",
    "logout": "Logout",
    
    // Onboarding
    "onboarding.welcome": "Welcome to HealthLock",
    "onboarding.description": "Securely share your health records with trusted healthcare providers",
    "onboarding.get_started": "Get Started",
    "auth.mobile": "Mobile Number",
    "auth.mobile.placeholder": "Enter your mobile number",
    "auth.otp": "Enter OTP",
    "auth.otp.placeholder": "Enter 6-digit OTP",
    "auth.role.select": "Select Your Role",
    "role.patient": "Patient",
    "role.doctor": "Doctor",
    "role.lab": "Lab/Pharmacy",
    "role.hospital": "Hospital Admin",
    "role.insurance": "Insurance",
    "role.regulator": "Regulator",
    "role.caregiver": "Family/Caregiver",
    
    // Patient Dashboard
    "patient.dashboard": "My Health Records",
    "patient.upload_record": "Upload New Record",
    "patient.active_shares": "Active Shares",
    "patient.audit_trail": "Access History",
    "patient.emergency_access": "Emergency Access",
    "patient.family_accounts": "Family Accounts",
    "patient.no_records": "No health records uploaded yet",
    "patient.upload_first": "Upload your first medical record to get started",
    
    // Doctor Dashboard
    "doctor.dashboard": "Patient Records",
    "doctor.scan_qr": "Scan Patient QR",
    "doctor.recent_access": "Recent Access",
    "doctor.request_records": "Request More Records",
    
    // Common actions
    "action.scan_qr": "Scan QR Code",
    "action.generate_qr": "Generate QR Code",
    "action.revoke_all": "Revoke All Access",
    "action.view_audit": "View Audit Trail",
    "action.manage_family": "Manage Family",
    
    // Records
    "record.prescription": "Prescription",
    "record.lab_report": "Lab Report",
    "record.xray": "X-Ray",
    "record.mri": "MRI Scan",
    "record.ct_scan": "CT Scan",
    "record.blood_test": "Blood Test",
    "record.discharge_summary": "Discharge Summary",
    
    // Status
    "status.active": "Active",
    "status.expired": "Expired",
    "status.revoked": "Revoked",
    "status.pending": "Pending",
    
    // Time
    "time.expires_in": "Expires in",
    "time.expired": "Expired",
    "time.just_now": "Just now",
    "time.minutes_ago": "minutes ago",
    "time.hours_ago": "hours ago",
    "time.days_ago": "days ago",
  },
  hi: {
    // General
    "app.title": "हेल्थलॉक",
    "app.tagline": "एन्क्रिप्ट करें। साझा करें। रद्द करें। भरोसा करें।",
    "language.toggle": "English",
    "continue": "जारी रखें",
    "back": "वापस",
    "next": "अगला",
    "save": "सेव करें",
    "cancel": "रद्द करें",
    "delete": "हटाएं",
    "edit": "संपादित करें",
    "view": "देखें",
    "share": "साझा करें",
    "revoke": "रद्द करें",
    "upload": "अपलोड करें",
    "download": "डाउनलोड करें",
    "scan": "QR स्कैन करें",
    "emergency": "आपातकाल",
    "logout": "लॉगआउट",
    
    // Onboarding
    "onboarding.welcome": "हेल्थलॉक में आपका स्वागत है",
    "onboarding.description": "विश्वसनीय स्वास्थ्य सेवा प्रदाताओं के साथ अपने स्वास्थ्य रिकॉर्ड सुरक्षित रूप से साझा करें",
    "onboarding.get_started": "शुरू करें",
    "auth.mobile": "मोबाइल नंबर",
    "auth.mobile.placeholder": "अपना मोबाइल नंबर दर्ज करें",
    "auth.otp": "OTP दर्ज करें",
    "auth.otp.placeholder": "6-अंकीय OTP दर्ज करें",
    "auth.role.select": "अपनी भूमिका चुनें",
    "role.patient": "मरीज़",
    "role.doctor": "डॉक्टर",
    "role.lab": "लैब/फार्मेसी",
    "role.hospital": "अस्पताल एडमिन",
    "role.insurance": "बीमा",
    "role.regulator": "नियामक",
    "role.caregiver": "परिवार/देखभालकर्ता",
    
    // Patient Dashboard
    "patient.dashboard": "मेरे स्वास्थ्य रिकॉर्ड",
    "patient.upload_record": "नया रिकॉर्ड अपलोड करें",
    "patient.active_shares": "सक्रिय साझाकरण",
    "patient.audit_trail": "एक्सेस हिस्ट्री",
    "patient.emergency_access": "आपातकालीन एक्सेस",
    "patient.family_accounts": "पारिवारिक खाते",
    "patient.no_records": "अभी तक कोई स्वास्थ्य रिकॉर्ड अपलोड नहीं किया गया",
    "patient.upload_first": "शुरू करने के लिए अपना पहला मेडिकल रिकॉर्ड अपलोड करें",
    
    // Doctor Dashboard
    "doctor.dashboard": "मरीज़ के रिकॉर्ड",
    "doctor.scan_qr": "मरीज़ का QR स्कैन करें",
    "doctor.recent_access": "हाल की एक्सेस",
    "doctor.request_records": "अधिक रिकॉर्ड का अनुरोध करें",
    
    // Common actions
    "action.scan_qr": "QR कोड स्कैन करें",
    "action.generate_qr": "QR कोड जेनरेट करें",
    "action.revoke_all": "सभी एक्सेस रद्द करें",
    "action.view_audit": "ऑडिट ट्रेल देखें",
    "action.manage_family": "परिवार प्रबंधित करें",
    
    // Records
    "record.prescription": "नुस्खा",
    "record.lab_report": "लैब रिपोर्ट",
    "record.xray": "एक्स-रे",
    "record.mri": "MRI स्कैन",
    "record.ct_scan": "CT स्कैन",
    "record.blood_test": "ब्लड टेस्ट",
    "record.discharge_summary": "डिस्चार्ज सारांश",
    
    // Status
    "status.active": "सक्रिय",
    "status.expired": "समाप्त",
    "status.revoked": "रद्द",
    "status.pending": "लंबित",
    
    // Time
    "time.expires_in": "में समाप्त होता है",
    "time.expired": "समाप्त",
    "time.just_now": "अभी-अभी",
    "time.minutes_ago": "मिनट पहले",
    "time.hours_ago": "घंटे पहले",
    "time.days_ago": "दिन पहले",
  }
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}