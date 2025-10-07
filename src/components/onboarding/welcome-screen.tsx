import React from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Shield, Lock, Share, RotateCcw } from "lucide-react";
import { useLanguage } from "../language-context";

interface WelcomeScreenProps {
  onGetStarted: () => void;
}

export function WelcomeScreen({ onGetStarted }: WelcomeScreenProps) {
  const { t, language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "hi" : "en");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-accent to-background flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center p-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="text-primary font-semibold">भारत सरकार | Government of India</div>
        </div>
        <Button variant="outline" size="sm" onClick={toggleLanguage}>
          {t("language.toggle")}
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-20">
        <div className="text-center space-y-6 max-w-md">
          {/* Logo */}
          <div className="flex justify-center">
            <div className="w-24 h-24 bg-primary rounded-3xl flex items-center justify-center shadow-lg">
              <Shield className="w-12 h-12 text-primary-foreground" />
            </div>
          </div>

          {/* Title and Tagline */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-primary">{t("app.title")}</h1>
            <p className="text-lg text-muted-foreground italic">
              "{t("app.tagline")}"
            </p>
          </div>

          {/* Description */}
          <p className="text-muted-foreground leading-relaxed">
            {t("onboarding.description")}
          </p>

          {/* Feature Cards */}
          <div className="grid grid-cols-2 gap-4 mt-8">
            <Card className="p-4">
              <CardContent className="p-0 text-center space-y-2">
                <Lock className="w-8 h-8 text-primary mx-auto" />
                <div className="font-medium">Encrypt</div>
                <div className="text-sm text-muted-foreground">End-to-end encryption</div>
              </CardContent>
            </Card>
            <Card className="p-4">
              <CardContent className="p-0 text-center space-y-2">
                <Share className="w-8 h-8 text-secondary mx-auto" />
                <div className="font-medium">Share</div>
                <div className="text-sm text-muted-foreground">QR-based access</div>
              </CardContent>
            </Card>
            <Card className="p-4">
              <CardContent className="p-0 text-center space-y-2">
                <RotateCcw className="w-8 h-8 text-destructive mx-auto" />
                <div className="font-medium">Revoke</div>
                <div className="text-sm text-muted-foreground">Instant access control</div>
              </CardContent>
            </Card>
            <Card className="p-4">
              <CardContent className="p-0 text-center space-y-2">
                <Shield className="w-8 h-8 text-primary mx-auto" />
                <div className="font-medium">Trust</div>
                <div className="text-sm text-muted-foreground">Audit trails</div>
              </CardContent>
            </Card>
          </div>

          {/* CTA */}
          <Button 
            onClick={onGetStarted}
            className="w-full h-12 mt-8 bg-primary hover:bg-primary/90"
            size="lg"
          >
            {t("onboarding.get_started")}
          </Button>

          {/* Footer */}
          <div className="text-xs text-muted-foreground mt-6">
            <div>Digital India Initiative</div>
            <div>Ayushman Bharat Digital Mission (ABDM) Compatible</div>
          </div>
        </div>
      </div>
    </div>
  );
}