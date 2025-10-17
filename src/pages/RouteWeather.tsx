import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import { Cloud, CloudRain, Sun, CloudSnow, Navigation, Info } from 'lucide-react';

// Fix for default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface WeatherPoint {
  lat: number;
  lon: number;
  city: string;
  weather: string;
  temp: number;
  description: string;
}

const RouteWeather = () => {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const routingControlRef = useRef<any>(null);
  const weatherMarkersRef = useRef<L.Marker[]>([]);
  
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [weatherPoints, setWeatherPoints] = useState<WeatherPoint[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Initialize map
    const map = L.map(mapContainerRef.current).setView([11.1271, 78.6569], 7); // Tamil Nadu center
    mapRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    // Try to get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          map.setView([latitude, longitude], 10);
          L.marker([latitude, longitude])
            .addTo(map)
            .bindPopup('Your Location')
            .openPopup();
        },
        (error) => {
          console.log('Geolocation error:', error);
        }
      );
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  const getWeatherIcon = (weatherMain: string) => {
    switch (weatherMain.toLowerCase()) {
      case 'rain':
      case 'drizzle':
        return CloudRain;
      case 'snow':
        return CloudSnow;
      case 'clear':
        return Sun;
      default:
        return Cloud;
    }
  };

  const fetchWeatherForPoint = async (lat: number, lon: number): Promise<WeatherPoint | null> => {
    try {
      const { data, error } = await supabase.functions.invoke('get-weather', {
        body: { lat, lon }
      });

      if (error) throw error;

      return {
        lat,
        lon,
        city: data.name || 'Unknown',
        weather: data.weather[0].main,
        temp: Math.round(data.main.temp),
        description: data.weather[0].description
      };
    } catch (error) {
      console.error('Error fetching weather:', error);
      return null;
    }
  };

  const planRoute = async () => {
    if (!origin || !destination) {
      toast({
        title: 'Missing Information',
        description: 'Please enter both origin and destination',
        variant: 'destructive'
      });
      return;
    }

    if (!mapRef.current) return;

    setIsLoading(true);
    setWeatherPoints([]);

    // Clear previous route and markers
    if (routingControlRef.current) {
      mapRef.current.removeControl(routingControlRef.current);
    }
    weatherMarkersRef.current.forEach(marker => marker.remove());
    weatherMarkersRef.current = [];

    try {
      // Geocode origin and destination
      const originGeo = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(origin)}`);
      const originData = await originGeo.json();
      
      const destGeo = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(destination)}`);
      const destData = await destGeo.json();

      if (!originData[0] || !destData[0]) {
        throw new Error('Location not found');
      }

      const originLatLng = L.latLng(parseFloat(originData[0].lat), parseFloat(originData[0].lon));
      const destLatLng = L.latLng(parseFloat(destData[0].lat), parseFloat(destData[0].lon));

      // Create routing control
      const routingControl = (L as any).Routing.control({
        waypoints: [originLatLng, destLatLng],
        routeWhileDragging: false,
        showAlternatives: false,
        lineOptions: {
          styles: [{ color: '#3b82f6', weight: 5 }]
        }
      }).addTo(mapRef.current);

      routingControlRef.current = routingControl;

      // When route is found, fetch weather along the route
      routingControl.on('routesfound', async (e: any) => {
        const route = e.routes[0];
        const coordinates = route.coordinates;
        
        // Sample points along the route (every ~30km)
        const sampledPoints: L.LatLng[] = [];
        const stepSize = Math.ceil(coordinates.length / 8); // Get about 8 points
        
        for (let i = 0; i < coordinates.length; i += stepSize) {
          sampledPoints.push(coordinates[i]);
        }

        // Fetch weather for each point
        const weatherPromises = sampledPoints.map(point => 
          fetchWeatherForPoint(point.lat, point.lng)
        );

        const weatherData = await Promise.all(weatherPromises);
        const validWeather = weatherData.filter((w): w is WeatherPoint => w !== null);
        
        setWeatherPoints(validWeather);

        // Add weather markers
        validWeather.forEach(weather => {
          const WeatherIcon = getWeatherIcon(weather.weather);
          
          const icon = L.divIcon({
            html: `<div style="background: white; border-radius: 50%; padding: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">
                    <div style="color: ${weather.weather === 'Rain' ? '#3b82f6' : weather.weather === 'Clear' ? '#eab308' : '#64748b'}">
                      ${weather.weather === 'Rain' ? '🌧️' : weather.weather === 'Clear' ? '☀️' : '☁️'}
                    </div>
                  </div>`,
            className: 'weather-marker',
            iconSize: [40, 40],
          });

          const marker = L.marker([weather.lat, weather.lon], { icon })
            .addTo(mapRef.current!)
            .bindPopup(`
              <strong>${weather.city}</strong><br/>
              ${weather.description}<br/>
              ${weather.temp}°C
            `);
          
          weatherMarkersRef.current.push(marker);
        });

        toast({
          title: 'Route Planned',
          description: `Weather conditions loaded for ${validWeather.length} points along your route`
        });
      });

    } catch (error) {
      console.error('Error planning route:', error);
      toast({
        title: 'Error',
        description: 'Failed to plan route. Please check your locations.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <Navigation className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Route Weather</h1>
        </div>

        <Card className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <Input
              placeholder="Origin (e.g., Karur)"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
            />
            <Input
              placeholder="Destination (e.g., Salem)"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button onClick={planRoute} disabled={isLoading} className="gap-2">
                    <Info className="h-4 w-4" />
                    {isLoading ? 'Planning...' : 'Plan Route'}
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>Enter your starting point and destination to see weather conditions along your route. We'll show you which areas have rain, clear skies, or clouds to help plan your journey!</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {weatherPoints.length > 0 && (
            <div className="mb-4 p-4 bg-blue-50 dark:bg-gray-800 rounded-lg">
              <h3 className="font-semibold mb-2">Weather Along Route:</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                {weatherPoints.map((point, idx) => {
                  const Icon = getWeatherIcon(point.weather);
                  return (
                    <div key={idx} className="flex items-center gap-2 p-2 bg-white dark:bg-gray-700 rounded">
                      <Icon className="h-4 w-4" />
                      <div>
                        <div className="font-medium">{point.city}</div>
                        <div className="text-xs text-muted-foreground">{point.temp}°C - {point.weather}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div ref={mapContainerRef} className="w-full h-[600px] rounded-lg overflow-hidden shadow-lg" />
        </Card>
      </div>
    </div>
  );
};

export default RouteWeather;
