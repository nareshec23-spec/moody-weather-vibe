import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";
import { MapPin, Thermometer, Droplets, Wind, Plus, X, Shuffle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface CityWeather {
  name: string;
  temp: number;
  condition: string;
  emoji: string;
  humidity: number;
  wind: number;
  climate: string;
}

const POPULAR_CITIES = [
  "New York", "London", "Tokyo", "Paris", "Dubai", "Singapore", 
  "Sydney", "Mumbai", "Berlin", "Toronto", "São Paulo", "Cairo",
  "Moscow", "Bangkok", "Istanbul", "Rome", "Seoul", "Mexico City",
  "Amsterdam", "Barcelona", "Los Angeles", "Hong Kong", "Miami", "Vienna"
];

const MultiCity = () => {
  const [cities, setCities] = useState<CityWeather[]>([]);
  const [newCity, setNewCity] = useState("");
  const [loading, setLoading] = useState(false);

  const getWeatherEmoji = (condition: string) => {
    const lower = condition.toLowerCase();
    if (lower.includes('clear') || lower.includes('sunny')) return '☀️';
    if (lower.includes('cloud')) return '☁️';
    if (lower.includes('rain')) return '🌧️';
    if (lower.includes('snow')) return '❄️';
    if (lower.includes('thunder') || lower.includes('storm')) return '⛈️';
    if (lower.includes('mist') || lower.includes('fog')) return '🌫️';
    if (lower.includes('drizzle')) return '🌦️';
    return '🌤️';
  };

  const getClimate = (temp: number, humidity: number) => {
    if (temp > 30 && humidity > 70) return "Tropical";
    if (temp > 35 && humidity < 50) return "Arid";
    if (temp < 10) return "Cold";
    return "Temperate";
  };

  const getClimateColor = (climate: string) => {
    switch(climate) {
      case "Tropical": return "text-green-500";
      case "Arid": return "text-orange-500";
      case "Temperate": return "text-blue-500";
      case "Cold": return "text-cyan-500";
      default: return "text-gray-500";
    }
  };

  const fetchCityWeather = async (cityName: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('get-weather', {
        body: { city: cityName }
      });

      if (error) {
        console.error('Error fetching weather:', error);
        return null;
      }

      if (!data) return null;

      const climate = getClimate(data.main.temp, data.main.humidity);

      return {
        name: data.name,
        temp: Math.round(data.main.temp),
        condition: data.weather[0].main,
        emoji: getWeatherEmoji(data.weather[0].main),
        humidity: data.main.humidity,
        wind: Math.round(data.wind.speed * 3.6),
        climate
      };
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  };

  const loadInitialCities = async () => {
    setLoading(true);
    const initialCities = ["New York", "London", "Tokyo", "Dubai", "Singapore", "Sydney"];
    const weatherPromises = initialCities.map(city => fetchCityWeather(city));
    const results = await Promise.all(weatherPromises);
    const validResults = results.filter((city): city is CityWeather => city !== null);
    setCities(validResults);
    setLoading(false);
  };

  useEffect(() => {
    loadInitialCities();
  }, []);

  const handleAddCity = async () => {
    if (!newCity.trim()) return;
    
    setLoading(true);
    const weather = await fetchCityWeather(newCity);
    
    if (weather) {
      if (cities.find(c => c.name.toLowerCase() === weather.name.toLowerCase())) {
        toast.error("City already added!");
      } else {
        setCities([...cities, weather]);
        toast.success(`${weather.name} added!`);
      }
      setNewCity("");
    } else {
      toast.error("City not found!");
    }
    setLoading(false);
  };

  const handleRandomCity = async () => {
    setLoading(true);
    const availableCities = POPULAR_CITIES.filter(
      city => !cities.find(c => c.name.toLowerCase() === city.toLowerCase())
    );
    
    if (availableCities.length === 0) {
      toast.error("All popular cities are already added!");
      setLoading(false);
      return;
    }

    const randomCity = availableCities[Math.floor(Math.random() * availableCities.length)];
    const weather = await fetchCityWeather(randomCity);
    
    if (weather) {
      setCities([...cities, weather]);
      toast.success(`Added ${weather.name}!`);
    }
    setLoading(false);
  };

  const handleRemoveCity = (cityName: string) => {
    setCities(cities.filter(c => c.name !== cityName));
    toast.success(`${cityName} removed`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Multi-City Weather Comparison</h1>

        {/* Add City Controls */}
        <Card className="p-6 mb-8">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Input
                placeholder="Enter city name..."
                value={newCity}
                onChange={(e) => setNewCity(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddCity()}
                disabled={loading}
              />
            </div>
            <Button onClick={handleAddCity} disabled={loading || !newCity.trim()}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
              Add City
            </Button>
            <Button onClick={handleRandomCity} disabled={loading} variant="secondary">
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Shuffle className="w-4 h-4 mr-2" />}
              Random City
            </Button>
          </div>
        </Card>

        {loading && cities.length === 0 ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cities.map((city, index) => (
                <Card 
                  key={index}
                  className="p-6 hover:shadow-xl transition-all hover:scale-105 relative"
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8"
                    onClick={() => handleRemoveCity(city.name)}
                  >
                    <X className="w-4 h-4" />
                  </Button>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-primary" />
                      <h3 className="text-xl font-bold">{city.name}</h3>
                    </div>
                    <span className="text-4xl">{city.emoji}</span>
                  </div>

                  <div className="mb-4">
                    <div className="text-4xl font-bold mb-1">{city.temp}°C</div>
                    <div className="text-muted-foreground">{city.condition}</div>
                    <div className={`text-sm font-medium mt-1 ${getClimateColor(city.climate)}`}>
                      {city.climate} Climate
                    </div>
                  </div>

                  <div className="space-y-2 pt-4 border-t border-border">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Droplets className="w-4 h-4 text-primary" />
                        <span className="text-sm">Humidity</span>
                      </div>
                      <span className="font-medium">{city.humidity}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Wind className="w-4 h-4 text-primary" />
                        <span className="text-sm">Wind</span>
                      </div>
                      <span className="font-medium">{city.wind} km/h</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Comparison Chart */}
            {cities.length > 0 && (
              <Card className="mt-8 p-6">
                <h2 className="text-2xl font-bold mb-6">Temperature Comparison</h2>
                <div className="space-y-4">
                  {cities.map((city, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{city.name}</span>
                        <span className="text-muted-foreground">{city.temp}°C</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-3">
                        <div 
                          className="bg-primary h-3 rounded-full transition-all"
                          style={{ width: `${Math.min((city.temp + 20) / 60 * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MultiCity;
