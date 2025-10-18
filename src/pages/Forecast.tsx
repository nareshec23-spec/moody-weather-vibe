import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { Search, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useApp } from "@/contexts/AppContext";

interface ForecastDay {
  day: string;
  temp: number;
  condition: string;
  icon: string;
  min: number;
  max: number;
  humidity: number;
}

const Forecast = () => {
  const { selectedCity, setSelectedCity, convertTemperature, getTempUnit } = useApp();
  const [searchCity, setSearchCity] = useState("");
  const [forecastData, setForecastData] = useState<ForecastDay[]>([]);
  const [hourlyData, setHourlyData] = useState<any[]>([]);
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

  const getDayName = (dateStr: string) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const date = new Date(dateStr);
    return days[date.getDay()];
  };

  const fetchForecast = async (cityName: string) => {
    setLoading(true);
    try {
      console.log('Fetching forecast for:', cityName);
      const { data, error } = await supabase.functions.invoke('get-forecast', {
        body: { city: cityName }
      });

      if (error) {
        console.error('Error fetching forecast:', error);
        toast.error("Failed to fetch forecast data");
        return;
      }

      if (!data || !data.list) {
        toast.error("No forecast data received");
        return;
      }

      // Process 5-day forecast (take one reading per day at noon)
      const dailyForecasts: ForecastDay[] = [];
      const processedDates = new Set();

      data.list.forEach((item: any) => {
        const date = new Date(item.dt * 1000);
        const dateStr = date.toDateString();
        
        // Take the noon reading (12:00) for each day
        if (date.getHours() === 12 && !processedDates.has(dateStr) && dailyForecasts.length < 5) {
          processedDates.add(dateStr);
          dailyForecasts.push({
            day: getDayName(dateStr),
            temp: Math.round(item.main.temp),
            condition: item.weather[0].main,
            icon: getWeatherEmoji(item.weather[0].main),
            min: Math.round(item.main.temp_min),
            max: Math.round(item.main.temp_max),
            humidity: item.main.humidity,
          });
        }
      });

      // Process hourly data for today (next 12 hours)
      const hourly = data.list.slice(0, 12).map((item: any) => ({
        time: new Date(item.dt * 1000),
        temp: Math.round(item.main.temp),
        icon: getWeatherEmoji(item.weather[0].main),
      }));

      setForecastData(dailyForecasts);
      setHourlyData(hourly);
      toast.success(`Forecast loaded for ${data.city.name}`);
    } catch (error) {
      console.error('Error:', error);
      toast.error("Failed to fetch forecast data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedCity) {
      setSearchCity(selectedCity);
      fetchForecast(selectedCity);
    }
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
        <h1 className="text-3xl md:text-4xl font-bold mb-6 md:mb-8">5-Day Forecast</h1>

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

        {loading && forecastData.length === 0 ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
              {forecastData.map((day, index) => (
                <Card 
                  key={index}
                  className="p-4 md:p-6 hover:shadow-xl transition-all hover:scale-105"
                >
                  <h3 className="text-lg font-semibold mb-3">{day.day}</h3>
                  <div className="text-5xl mb-4 text-center">{day.icon}</div>
                  <div className="text-3xl font-bold text-center mb-2">
                    {convertTemperature(day.temp)}{getTempUnit()}
                  </div>
                  <div className="text-muted-foreground text-center mb-3">{day.condition}</div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Min: {convertTemperature(day.min)}{getTempUnit()}</span>
                    <span>Max: {convertTemperature(day.max)}{getTempUnit()}</span>
                  </div>
                  <div className="mt-2 text-sm text-center text-muted-foreground">
                    Humidity: {day.humidity}%
                  </div>
                </Card>
              ))}
            </div>

            {/* Hourly Forecast */}
            {hourlyData.length > 0 && (
              <Card className="mt-6 md:mt-8 p-4 md:p-6">
                <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Hourly Forecast</h2>
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-12 gap-3 md:gap-4">
                  {hourlyData.map((hour, i) => (
                    <div key={i} className="text-center">
                      <div className="text-sm text-muted-foreground mb-2">
                        {hour.time.getHours().toString().padStart(2, '0')}:00
                      </div>
                      <div className="text-2xl mb-2">{hour.icon}</div>
                      <div className="font-semibold">
                        {convertTemperature(hour.temp)}{getTempUnit()}
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

export default Forecast;
