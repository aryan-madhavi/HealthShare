import React, { useState } from "react";
import { LanguageProvider } from "./components/language-context";
import { AuthProvider, useAuth } from "./components/auth-context";
import { WelcomeScreen } from "./components/onboarding/welcome-screen";
import { AuthScreen } from "./components/onboarding/auth-screen";
import { PatientDashboard } from "./components/patient/patient-dashboard";
import { DoctorDashboard } from "./components/doctor/doctor-dashboard";
import { Header } from "./components/shared/header";

function AppContent() {
  const { user, isAuthenticated } = useAuth();
  const [currentScreen, setCurrentScreen] = useState<"welcome" | "auth">("welcome");

  // If user is authenticated, show role-specific dashboard
  if (isAuthenticated && user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        {user.role === "patient" && <PatientDashboard />}
        {user.role === "doctor" && <DoctorDashboard />}
        {user.role === "lab" && (
          <div className="flex items-center justify-center min-h-[60vh] text-center">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Lab/Pharmacy Dashboard</h2>
              <p className="text-muted-foreground">Lab and pharmacy interface coming soon...</p>
            </div>
          </div>
        )}
        {user.role === "hospital" && (
          <div className="flex items-center justify-center min-h-[60vh] text-center">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Hospital Admin Dashboard</h2>
              <p className="text-muted-foreground">Hospital administration interface coming soon...</p>
            </div>
          </div>
        )}
        {user.role === "insurance" && (
          <div className="flex items-center justify-center min-h-[60vh] text-center">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Insurance Dashboard</h2>
              <p className="text-muted-foreground">Insurance claims interface coming soon...</p>
            </div>
          </div>
        )}
        {user.role === "regulator" && (
          <div className="flex items-center justify-center min-h-[60vh] text-center">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Regulatory Dashboard</h2>
              <p className="text-muted-foreground">Audit and compliance interface coming soon...</p>
            </div>
          </div>
        )}
        {user.role === "caregiver" && (
          <div className="flex items-center justify-center min-h-[60vh] text-center">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Family/Caregiver Dashboard</h2>
              <p className="text-muted-foreground">Family member management interface coming soon...</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Onboarding flow
  if (currentScreen === "welcome") {
    return (
      <WelcomeScreen 
        onGetStarted={() => setCurrentScreen("auth")} 
      />
    );
  }

  if (currentScreen === "auth") {
    return (
      <AuthScreen 
        onBack={() => setCurrentScreen("welcome")} 
      />
    );
  }

  return null;
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </LanguageProvider>
  );
}