import React from "react";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Shield, LogOut, Settings, User } from "lucide-react";
import { useLanguage } from "../language-context";
import { useAuth } from "../auth-context";

export function Header() {
  const { t, language, setLanguage } = useLanguage();
  const { user, logout } = useAuth();

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "hi" : "en");
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "patient": return "bg-primary text-primary-foreground";
      case "doctor": return "bg-secondary text-secondary-foreground";
      case "lab": return "bg-chart-4 text-white";
      case "hospital": return "bg-primary text-primary-foreground";
      case "insurance": return "bg-chart-5 text-white";
      case "regulator": return "bg-destructive text-destructive-foreground";
      case "caregiver": return "bg-chart-2 text-white";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <header className="bg-white border-b border-border shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <div className="font-semibold text-primary">{t("app.title")}</div>
              <div className="text-xs text-muted-foreground">भारत सरकार | Government of India</div>
            </div>
          </div>

          {/* User Info & Controls */}
          <div className="flex items-center gap-3">
            {/* Language Toggle */}
            <Button variant="outline" size="sm" onClick={toggleLanguage}>
              {t("language.toggle")}
            </Button>

            {/* User Menu */}
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 p-2">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="text-sm">
                        {user.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-left hidden sm:block">
                      <div className="font-medium text-sm">{user.name}</div>
                      <div className="text-xs text-muted-foreground">+91 {user.mobile}</div>
                    </div>
                    <Badge 
                      variant="secondary" 
                      className={`text-xs hidden sm:inline-flex ${getRoleColor(user.role)}`}
                    >
                      {t(`role.${user.role}`)}
                    </Badge>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem>
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout} className="text-destructive">
                    <LogOut className="w-4 h-4 mr-2" />
                    {t("logout")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}