import { Card } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import { Cloud, CloudRain, Sun, Wind } from "lucide-react";

const Forecast = () => {
  const forecastData = [
    { day: 'Monday', temp: 24, condition: 'Sunny', icon: '☀️', min: 18, max: 26 },
    { day: 'Tuesday', temp: 22, condition: 'Partly Cloudy', icon: '⛅', min: 16, max: 24 },
    { day: 'Wednesday', temp: 19, condition: 'Rainy', icon: '🌧️', min: 15, max: 21 },
    { day: 'Thursday', temp: 21, condition: 'Cloudy', icon: '☁️', min: 17, max: 23 },
    { day: 'Friday', temp: 25, condition: 'Sunny', icon: '☀️', min: 19, max: 27 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">5-Day Forecast</h1>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
          {forecastData.map((day, index) => (
            <Card 
              key={index}
              className="p-6 hover:shadow-xl transition-all hover:scale-105"
            >
              <h3 className="text-lg font-semibold mb-3">{day.day}</h3>
              <div className="text-5xl mb-4 text-center">{day.icon}</div>
              <div className="text-3xl font-bold text-center mb-2">{day.temp}°C</div>
              <div className="text-muted-foreground text-center mb-3">{day.condition}</div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Min: {day.min}°C</span>
                <span>Max: {day.max}°C</span>
              </div>
            </Card>
          ))}
        </div>

        {/* Hourly Forecast */}
        <Card className="mt-8 p-6">
          <h2 className="text-2xl font-bold mb-6">Today's Hourly Forecast</h2>
          <div className="grid grid-cols-6 md:grid-cols-12 gap-4">
            {Array.from({ length: 12 }, (_, i) => (
              <div key={i} className="text-center">
                <div className="text-sm text-muted-foreground mb-2">
                  {(i + 8).toString().padStart(2, '0')}:00
                </div>
                <div className="text-2xl mb-2">
                  {i % 3 === 0 ? '☀️' : i % 2 === 0 ? '⛅' : '☁️'}
                </div>
                <div className="font-semibold">
                  {20 + Math.floor(Math.random() * 8)}°
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Forecast;
