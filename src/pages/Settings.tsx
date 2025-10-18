import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { Settings as SettingsIcon, Palette, Globe, Wind, Gauge } from "lucide-react";
import { toast } from "sonner";
import { useApp } from "@/contexts/AppContext";
import { useState } from "react";

const Settings = () => {
  const { settings, updateSettings } = useApp();
  const [localSettings, setLocalSettings] = useState(settings);

  const handleSave = () => {
    updateSettings(localSettings);
    toast.success("Settings applied successfully!");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-6 md:py-8 max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 md:mb-8 flex items-center gap-3">
          <SettingsIcon className="w-8 h-8 md:w-10 md:h-10 text-primary" />
          Settings
        </h1>

        <div className="space-y-4 md:space-y-6">
          {/* Temperature & Units */}
          <Card className="p-4 md:p-6">
            <div className="flex items-center gap-3 mb-4">
              <Palette className="w-5 h-5 md:w-6 md:h-6 text-primary" />
              <h2 className="text-xl md:text-2xl font-bold">Units & Display</h2>
            </div>
            <div className="grid gap-4 md:gap-6 sm:grid-cols-2">
              <div>
                <Label htmlFor="temp-unit" className="text-sm md:text-lg mb-2 block">Temperature Unit</Label>
                <Select 
                  value={localSettings.temperatureUnit} 
                  onValueChange={(value) => setLocalSettings({ ...localSettings, temperatureUnit: value as any })}
                >
                  <SelectTrigger id="temp-unit">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="celsius">Celsius (°C)</SelectItem>
                    <SelectItem value="fahrenheit">Fahrenheit (°F)</SelectItem>
                    <SelectItem value="kelvin">Kelvin (K)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="wind-unit" className="text-sm md:text-lg mb-2 block">Wind Speed Unit</Label>
                <Select 
                  value={localSettings.windSpeedUnit} 
                  onValueChange={(value) => setLocalSettings({ ...localSettings, windSpeedUnit: value as any })}
                >
                  <SelectTrigger id="wind-unit">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kmh">km/h</SelectItem>
                    <SelectItem value="mph">mph</SelectItem>
                    <SelectItem value="ms">m/s</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="pressure-unit" className="text-sm md:text-lg mb-2 block">Pressure Unit</Label>
                <Select 
                  value={localSettings.pressureUnit} 
                  onValueChange={(value) => setLocalSettings({ ...localSettings, pressureUnit: value as any })}
                >
                  <SelectTrigger id="pressure-unit">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hpa">hPa</SelectItem>
                    <SelectItem value="inhg">inHg</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="time-format" className="text-sm md:text-lg mb-2 block">Time Format</Label>
                <Select 
                  value={localSettings.timeFormat} 
                  onValueChange={(value) => setLocalSettings({ ...localSettings, timeFormat: value as any })}
                >
                  <SelectTrigger id="time-format">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="12h">12-hour</SelectItem>
                    <SelectItem value="24h">24-hour</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          {/* Language & Localization */}
          <Card className="p-4 md:p-6">
            <div className="flex items-center gap-3 mb-4">
              <Globe className="w-5 h-5 md:w-6 md:h-6 text-primary" />
              <h2 className="text-xl md:text-2xl font-bold">Language & Localization</h2>
            </div>
            <div>
              <Label htmlFor="language" className="text-sm md:text-lg mb-2 block">Language</Label>
              <Select 
                value={localSettings.language} 
                onValueChange={(value) => setLocalSettings({ ...localSettings, language: value })}
              >
                <SelectTrigger id="language">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="de">Deutsch</SelectItem>
                  <SelectItem value="ja">日本語</SelectItem>
                  <SelectItem value="zh">中文</SelectItem>
                  <SelectItem value="ar">العربية</SelectItem>
                  <SelectItem value="pt">Português</SelectItem>
                  <SelectItem value="ru">Русский</SelectItem>
                  <SelectItem value="hi">हिन्दी</SelectItem>
                  <SelectItem value="ta">தமிழ்</SelectItem>
                  <SelectItem value="ko">한국어</SelectItem>
                  <SelectItem value="it">Italiano</SelectItem>
                  <SelectItem value="nl">Nederlands</SelectItem>
                  <SelectItem value="tr">Türkçe</SelectItem>
                  <SelectItem value="pl">Polski</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs md:text-sm text-muted-foreground mt-2">
                Selected: {localSettings.language.toUpperCase()} • More languages coming soon
              </p>
            </div>
          </Card>

          {/* Theme */}
          <Card className="p-4 md:p-6">
            <div className="flex items-center gap-3 mb-4">
              <Palette className="w-5 h-5 md:w-6 md:h-6 text-primary" />
              <h2 className="text-xl md:text-2xl font-bold">Appearance</h2>
            </div>
            <div>
              <Label htmlFor="theme" className="text-sm md:text-lg mb-2 block">Theme</Label>
              <Select 
                value={localSettings.theme} 
                onValueChange={(value) => setLocalSettings({ ...localSettings, theme: value as any })}
              >
                <SelectTrigger id="theme">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">☀️ Light</SelectItem>
                  <SelectItem value="dark">🌙 Dark</SelectItem>
                  <SelectItem value="auto">🔄 Auto</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button size="lg" onClick={handleSave} className="w-full sm:w-auto">
              Save Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
