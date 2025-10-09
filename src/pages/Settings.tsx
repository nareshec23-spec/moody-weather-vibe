import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { Settings as SettingsIcon, Bell, Globe, Palette } from "lucide-react";
import { toast } from "sonner";

const Settings = () => {
  const [temperatureUnit, setTemperatureUnit] = useState("celsius");
  const [notifications, setNotifications] = useState(true);
  const [autoLocation, setAutoLocation] = useState(false);
  const [language, setLanguage] = useState("en");

  const handleSave = () => {
    toast.success("Settings saved successfully!");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 flex items-center gap-3">
          <SettingsIcon className="w-10 h-10 text-primary" />
          Settings
        </h1>

        <div className="space-y-6">
          {/* Temperature Unit */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Palette className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold">Display Preferences</h2>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="temp-unit" className="text-lg mb-2 block">Temperature Unit</Label>
                <Select value={temperatureUnit} onValueChange={setTemperatureUnit}>
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
                <Label htmlFor="language" className="text-lg mb-2 block">Language</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger id="language">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="de">Deutsch</SelectItem>
                    <SelectItem value="ja">日本語</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          {/* Notifications */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Bell className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold">Notifications</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="notifications" className="text-lg">Weather Alerts</Label>
                  <p className="text-sm text-muted-foreground">Get notified about severe weather conditions</p>
                </div>
                <Switch 
                  id="notifications" 
                  checked={notifications}
                  onCheckedChange={setNotifications}
                />
              </div>
            </div>
          </Card>

          {/* Location */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Globe className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold">Location</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="auto-location" className="text-lg">Auto-detect Location</Label>
                  <p className="text-sm text-muted-foreground">Automatically use your current location</p>
                </div>
                <Switch 
                  id="auto-location" 
                  checked={autoLocation}
                  onCheckedChange={setAutoLocation}
                />
              </div>
            </div>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button size="lg" onClick={handleSave}>
              Save Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
