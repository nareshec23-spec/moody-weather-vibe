import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Droplets, Wind, Sun, Eye, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import VoiceAssistant from "@/components/VoiceAssistant";
import { supabase } from "@/integrations/supabase/client";
import { useApp } from "@/contexts/AppContext";

const Dashboard = () => {
  const { selectedCity, setSelectedCity, convertTemperature, getTempUnit } = useApp();
  const [searchCity, setSearchCity] = useState("");
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const getWeatherEmoji = (condition: string) => {
    const lower = condition.toLowerCase();
    if (lower.includes('clear') || lower.includes('sunny')) return '☀️';
    if (lower.includes('cloud')) return '☁️';
    if (lower.includes('rain')) return '🌧️';
    if (lower.includes('snow')) return '❄️';
    if (lower.includes('thunder') || lower.includes('storm')) return '⛈️';
    if (lower.includes('mist') || lower.includes('fog')) return '🌫️';
    return '🌤️';
  };

  const fetchWeather = async (cityName: string) => {
    setLoading(true);
    try {
      console.log('Fetching weather for:', cityName);
      const { data, error } = await supabase.functions.invoke('get-weather', {
        body: { city: cityName }
      });

      if (error) {
        console.error('Error fetching weather:', error);
        toast.error("Failed to fetch weather data");
        return;
      }

      if (!data) {
        toast.error("No weather data received");
        return;
      }

      const weatherData = {
        city: data.name,
        temperature: Math.round(data.main.temp),
        feelsLike: Math.round(data.main.feels_like),
        condition: data.weather[0].main,
        description: data.weather[0].description,
        humidity: data.main.humidity,
        windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
        visibility: Math.round(data.visibility / 1000),
        pressure: data.main.pressure,
        cloudiness: data.clouds?.all || 0,
      };
      
      setWeather(weatherData);
      toast.success(`Weather loaded for ${data.name}`);
    } catch (error) {
      console.error('Error:', error);
      toast.error("Failed to fetch weather data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(selectedCity);
  }, [selectedCity]);

  const handleSearch = () => {
    if (searchCity.trim()) {
      setSelectedCity(searchCity);
      setSearchCity("");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-6 md:py-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 md:mb-8">Weather Dashboard</h1>
        
        {/* Voice Assistant */}
        <div className="mb-6 md:mb-8">
          <VoiceAssistant />
        </div>

        {/* Search Section */}
        <Card className="p-4 md:p-6 mb-6 md:mb-8 shadow-lg">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                placeholder="Search for a city..."
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10"
                disabled={loading}
              />
            </div>
            <Button onClick={handleSearch} disabled={loading || !searchCity.trim()} className="w-full sm:w-auto">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Search'}
            </Button>
          </div>
        </Card>

        {weather && (
          <>
            {/* Current Weather Card */}
            <Card className="p-8 mb-8 shadow-xl bg-gradient-to-br from-primary/10 via-card to-secondary/10">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-primary" />
                <h2 className="text-2xl font-bold">{weather.city}</h2>
              </div>
              
              <div className="flex items-center justify-between">
              <div>
                <div className="text-6xl font-bold mb-2">
                  {convertTemperature(weather.temperature)}{getTempUnit()}
                </div>
                <div className="text-xl text-muted-foreground flex items-center gap-2">
                  <span className="text-3xl">{getWeatherEmoji(weather.condition)}</span>
                  <div>
                    <div>{weather.condition}</div>
                    <div className="text-sm capitalize">{weather.description}</div>
                  </div>
                </div>
                <div className="text-muted-foreground mt-2">
                  Feels like {convertTemperature(weather.feelsLike)}{getTempUnit()}
                </div>
              </div>
              </div>
            </Card>

            {/* Weather Details Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-2">
                  <Droplets className="w-8 h-8 text-primary" />
                  <span className="text-muted-foreground">Humidity</span>
                </div>
                <div className="text-3xl font-bold">{weather.humidity}%</div>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-2">
                  <Wind className="w-8 h-8 text-primary" />
                  <span className="text-muted-foreground">Wind Speed</span>
                </div>
                <div className="text-3xl font-bold">{weather.windSpeed} km/h</div>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-2">
                  <Sun className="w-8 h-8 text-secondary" />
                  <span className="text-muted-foreground">Pressure</span>
                </div>
                <div className="text-3xl font-bold">{weather.pressure} hPa</div>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-2">
                  <Eye className="w-8 h-8 text-primary" />
                  <span className="text-muted-foreground">Cloudiness</span>
                </div>
                <div className="text-3xl font-bold">{weather.cloudiness}%</div>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
