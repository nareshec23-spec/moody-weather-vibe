import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
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
  const [routeDistance, setRouteDistance] = useState<number>(0);
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
    setRouteDistance(0);

    // Clear previous route and markers
    if (routingControlRef.current) {
      mapRef.current.removeControl(routingControlRef.current);
    }
    weatherMarkersRef.current.forEach(marker => marker.remove());
    weatherMarkersRef.current = [];

    try {
      // Geocode origin and destination with better search parameters
      const originGeo = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(origin)}&limit=5&addressdetails=1`);
      const originData = await originGeo.json();
      
      await new Promise(resolve => setTimeout(resolve, 1000)); // Rate limiting
      
      const destGeo = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(destination)}&limit=5&addressdetails=1`);
      const destData = await destGeo.json();

      if (!originData || originData.length === 0) {
        throw new Error(`Origin location "${origin}" not found. Please try a different city name.`);
      }
      
      if (!destData || destData.length === 0) {
        throw new Error(`Destination location "${destination}" not found. Please try a different city name.`);
      }

      const originLatLng = L.latLng(parseFloat(originData[0].lat), parseFloat(originData[0].lon));
      const destLatLng = L.latLng(parseFloat(destData[0].lat), parseFloat(destData[0].lon));

      // Fit map bounds to show both locations
      mapRef.current.fitBounds(L.latLngBounds([originLatLng, destLatLng]), { padding: [50, 50] });

      // Create routing control with custom options
      const routingControl = (L as any).Routing.control({
        waypoints: [originLatLng, destLatLng],
        routeWhileDragging: false,
        showAlternatives: false,
        addWaypoints: false,
        lineOptions: {
          styles: [{ color: '#3b82f6', weight: 5, opacity: 0.7 }]
        },
        createMarker: function(i: number, waypoint: any, n: number) {
          const marker = L.marker(waypoint.latLng, {
            draggable: false,
            icon: L.divIcon({
              html: i === 0 ? '🚩' : '🏁',
              className: 'route-marker',
              iconSize: [30, 30]
            })
          });
          return marker;
        }
      }).addTo(mapRef.current);

      routingControlRef.current = routingControl;

      // When route is found, fetch weather along the route
      routingControl.on('routesfound', async (e: any) => {
        const route = e.routes[0];
        const coordinates = route.coordinates;
        const distanceInKm = (route.summary.totalDistance / 1000).toFixed(1);
        setRouteDistance(parseFloat(distanceInKm));
        
        // Sample points intelligently along the route
        const sampledPoints: L.LatLng[] = [];
        const minDistanceBetweenPoints = 30000; // 30km minimum distance
        
        sampledPoints.push(coordinates[0]); // Always include start
        
        for (let i = 1; i < coordinates.length - 1; i++) {
          const lastPoint = sampledPoints[sampledPoints.length - 1];
          const distance = lastPoint.distanceTo(coordinates[i]);
          
          if (distance >= minDistanceBetweenPoints && sampledPoints.length < 6) {
            sampledPoints.push(coordinates[i]);
          }
        }
        
        sampledPoints.push(coordinates[coordinates.length - 1]); // Always include end

        // Fetch weather for each point
        const weatherPromises = sampledPoints.map(point => 
          fetchWeatherForPoint(point.lat, point.lng)
        );

        const weatherData = await Promise.all(weatherPromises);
        const validWeather = weatherData.filter((w): w is WeatherPoint => w !== null);
        
        // Remove duplicates based on city name
        const uniqueWeather = validWeather.filter((weather, index, self) =>
          index === self.findIndex((w) => w.city === weather.city)
        );
        
        setWeatherPoints(uniqueWeather);

        // Add weather markers
        uniqueWeather.forEach(weather => {
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
          description: `${distanceInKm} km route with weather data for ${uniqueWeather.length} locations`
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
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="flex items-center gap-3 mb-6">
          <Navigation className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Route Weather</h1>
        </div>

        <Card className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
...
          </div>

          <div ref={mapContainerRef} className="w-full h-[600px] rounded-lg overflow-hidden shadow-lg" />
        </Card>
      </div>
    </div>
  );
};

export default RouteWeather;
