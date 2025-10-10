import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AppSettings {
  temperatureUnit: "celsius" | "fahrenheit" | "kelvin";
  notifications: boolean;
  autoLocation: boolean;
  language: string;
}

interface AppContextType {
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  settings: AppSettings;
  updateSettings: (settings: AppSettings) => void;
  convertTemperature: (temp: number) => number;
  getTempUnit: () => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [selectedCity, setSelectedCityState] = useState("New York");
  const [settings, setSettings] = useState<AppSettings>({
    temperatureUnit: "celsius",
    notifications: true,
    autoLocation: false,
    language: "en",
  });

  // Load settings and city from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('weatherSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
    
    const savedCity = localStorage.getItem('selectedCity');
    if (savedCity) {
      setSelectedCityState(savedCity);
    }
  }, []);

  const setSelectedCity = (city: string) => {
    setSelectedCityState(city);
    localStorage.setItem('selectedCity', city);
  };

  const updateSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    localStorage.setItem('weatherSettings', JSON.stringify(newSettings));
  };

  const convertTemperature = (temp: number): number => {
    switch (settings.temperatureUnit) {
      case "fahrenheit":
        return Math.round((temp * 9/5) + 32);
      case "kelvin":
        return Math.round(temp + 273.15);
      default:
        return Math.round(temp);
    }
  };

  const getTempUnit = (): string => {
    switch (settings.temperatureUnit) {
      case "fahrenheit":
        return "°F";
      case "kelvin":
        return "K";
      default:
        return "°C";
    }
  };

  return (
    <AppContext.Provider
      value={{
        selectedCity,
        setSelectedCity,
        settings,
        updateSettings,
        convertTemperature,
        getTempUnit,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
};
