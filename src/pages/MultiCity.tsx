import { Card } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import { MapPin, Thermometer, Droplets, Wind } from "lucide-react";

const MultiCity = () => {
  const cities = [
    { name: "New York", temp: 22, condition: "Sunny", emoji: "☀️", humidity: 65, wind: 12, climate: "Temperate" },
    { name: "Tokyo", temp: 18, condition: "Cloudy", emoji: "☁️", humidity: 75, wind: 8, climate: "Temperate" },
    { name: "Dubai", temp: 38, condition: "Clear", emoji: "🔥", humidity: 40, wind: 15, climate: "Arid" },
    { name: "London", temp: 15, condition: "Rainy", emoji: "🌧️", humidity: 85, wind: 20, climate: "Temperate" },
    { name: "Singapore", temp: 30, condition: "Humid", emoji: "🌴", humidity: 90, wind: 10, climate: "Tropical" },
    { name: "Sydney", temp: 24, condition: "Partly Cloudy", emoji: "⛅", humidity: 60, wind: 14, climate: "Temperate" },
  ];

  const getClimateColor = (climate: string) => {
    switch(climate) {
      case "Tropical": return "text-green-500";
      case "Arid": return "text-orange-500";
      case "Temperate": return "text-blue-500";
      default: return "text-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Multi-City Weather Comparison</h1>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cities.map((city, index) => (
            <Card 
              key={index}
              className="p-6 hover:shadow-xl transition-all hover:scale-105"
            >
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
                    style={{ width: `${(city.temp / 40) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default MultiCity;
