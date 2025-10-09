import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Droplets, Wind, Sun, Eye } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";

const Dashboard = () => {
  const [city, setCity] = useState("New York");
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
      // Simulated weather data - in production, this would call OpenWeatherMap API
      const mockData = {
        city: cityName,
        temperature: Math.floor(Math.random() * 30) + 10,
        feelsLike: Math.floor(Math.random() * 30) + 10,
        condition: ['Clear', 'Cloudy', 'Rainy', 'Sunny'][Math.floor(Math.random() * 4)],
        humidity: Math.floor(Math.random() * 40) + 40,
        windSpeed: Math.floor(Math.random() * 20) + 5,
        uvIndex: Math.floor(Math.random() * 10) + 1,
        visibility: Math.floor(Math.random() * 5) + 5,
      };
      
      setWeather(mockData);
      toast.success(`Weather loaded for ${cityName}`);
    } catch (error) {
      toast.error("Failed to fetch weather data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(city);
  }, [city]);

  const handleSearch = () => {
    if (searchCity.trim()) {
      setCity(searchCity);
      setSearchCity("");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Search Section */}
        <Card className="p-6 mb-8 shadow-lg">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                placeholder="Search for a city..."
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10"
              />
            </div>
            <Button onClick={handleSearch} disabled={loading}>
              Search
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
                  <div className="text-6xl font-bold mb-2">{weather.temperature}°C</div>
                  <div className="text-xl text-muted-foreground flex items-center gap-2">
                    <span className="text-3xl">{getWeatherEmoji(weather.condition)}</span>
                    {weather.condition}
                  </div>
                  <div className="text-muted-foreground mt-2">
                    Feels like {weather.feelsLike}°C
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
                  <span className="text-muted-foreground">UV Index</span>
                </div>
                <div className="text-3xl font-bold">{weather.uvIndex}</div>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-2">
                  <Eye className="w-8 h-8 text-primary" />
                  <span className="text-muted-foreground">Visibility</span>
                </div>
                <div className="text-3xl font-bold">{weather.visibility} km</div>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
