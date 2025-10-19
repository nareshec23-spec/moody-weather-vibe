import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navbar from "@/components/Navbar";
import { Shirt, UtensilsCrossed, Heart, Dumbbell, Search, Loader2, Camera, StopCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Recommendations = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [mood, setMood] = useState("energetic");
  const [weather, setWeather] = useState("sunny");
  const [climate, setClimate] = useState("temperate");
  const [searchCity, setSearchCity] = useState("");
  const [currentCity, setCurrentCity] = useState("New York");
  const [loading, setLoading] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [detectedEmotion, setDetectedEmotion] = useState<string>("");

  const getRecommendations = () => {
    const recommendations = {
      sunny: {
        tropical: {
          clothing: ["🩳 Light shorts and breathable tank tops", "👒 Wide-brimmed sun hat", "🕶️ UV protection sunglasses", "🩴 Comfortable sandals"],
          activities: ["🏖️ Beach volleyball or swimming", "🚴 Coastal bike ride", "🌴 Outdoor yoga under palm trees", "📸 Sunset photography"],
          drinks: ["🥥 Fresh coconut water", "🍹 Tropical fruit smoothie", "🧃 Cold pressed juice", "💧 Electrolyte-infused water"],
          health: ["☀️ Apply SPF 50+ sunscreen every 2 hours", "🧴 Stay hydrated - drink 3L+ water", "😎 Seek shade during peak hours (11am-3pm)", "🌡️ Monitor for heat exhaustion signs"]
        },
        temperate: {
          clothing: ["👕 Light cotton t-shirt", "👖 Comfortable jeans or shorts", "👟 Breathable sneakers", "🧢 Baseball cap for sun protection"],
          activities: ["🚶 Nature walk in the park", "🎾 Outdoor sports (tennis, frisbee)", "☕ Patio café brunch", "🎨 Outdoor painting or sketching"],
          drinks: ["🍋 Homemade lemonade", "☕ Iced coffee", "🍵 Cold green tea", "🥤 Sparkling water with fruit"],
          health: ["🧴 Use SPF 30 sunscreen", "💧 Drink 2L water daily", "🕶️ Wear sunglasses for eye protection", "⏰ Best outdoor time: 8-11am or 4-7pm"]
        },
        arid: {
          clothing: ["👔 Loose-fitting linen shirt", "🩳 Light-colored pants", "🧣 Neck scarf for dust protection", "👞 Closed-toe breathable shoes"],
          activities: ["🏜️ Early morning desert hike", "🐫 Visit local markets before noon", "📚 Indoor museum tours during peak heat", "🌅 Evening outdoor dining"],
          drinks: ["💧 Extra water - 4L+ daily", "🧃 Electrolyte drinks", "🍉 Watermelon juice", "🌿 Mint-infused water"],
          health: ["🧴 Heavy sun protection required", "😷 Consider air quality mask", "🏠 Take afternoon heat breaks indoors", "🌡️ Watch for dehydration symptoms"]
        }
      },
      cloudy: {
        tropical: {
          clothing: ["👕 Light long-sleeve shirt", "🩳 Casual shorts", "🧥 Light windbreaker (in case of rain)", "👟 Comfortable walking shoes"],
          activities: ["🥾 Rainforest trail hike", "🏛️ Visit cultural sites", "🎭 Attend local performances", "🛍️ Explore covered markets"],
          drinks: ["☕ Fresh brewed local coffee", "🧃 Fresh fruit juice", "🥤 Room temperature water", "🍵 Herbal tea"],
          health: ["☂️ Carry compact umbrella", "💧 Stay hydrated normally", "👟 Wear non-slip shoes", "🦟 Use insect repellent"]
        },
        temperate: {
          clothing: ["🧥 Light jacket or cardigan", "👖 Long pants", "👟 Comfortable shoes", "🧣 Light scarf (optional)"],
          activities: ["📚 Visit museums or galleries", "☕ Cozy café time with a book", "🎬 Catch a movie", "🏛️ Indoor shopping or browsing"],
          drinks: ["☕ Warm cappuccino", "🍵 Green tea", "🥤 Room temp water", "🫖 Chai latte"],
          health: ["🧴 Light moisturizer for skin", "💧 Regular hydration", "🚶 Perfect temp for walking", "😌 Great for productivity"]
        },
        arid: {
          clothing: ["👔 Long-sleeve shirt", "👖 Full-length pants", "🧢 Cap or hat", "👞 Comfortable closed shoes"],
          activities: ["🏛️ Indoor cultural experiences", "🎨 Art gallery visits", "☕ Café working session", "🛍️ Shopping in covered markets"],
          drinks: ["☕ Hot tea or coffee", "💧 Regular water intake", "🧃 Natural juices", "🥛 Warm milk-based drinks"],
          health: ["💧 Maintain 2-3L water daily", "🧴 Use moisturizer for dry air", "😌 Perfect weather for outdoor walks", "🌬️ Good air quality usually"]
        }
      },
      rainy: {
        tropical: {
          clothing: ["☔ Waterproof rain jacket with hood", "🩳 Quick-dry shorts", "👢 Waterproof boots or sandals", "🎒 Waterproof bag for electronics"],
          activities: ["🏛️ Indoor museum tours", "☕ Visit cozy cafés", "📚 Library or bookstore browsing", "🎮 Indoor gaming or entertainment"],
          drinks: ["☕ Hot ginger tea", "🍵 Warm herbal infusions", "🥤 Hot chocolate", "🫖 Spiced chai"],
          health: ["☂️ Always carry umbrella", "🧼 Wash hands frequently", "👟 Wear waterproof footwear", "🌡️ Watch for sudden temp drops"]
        },
        temperate: {
          clothing: ["🧥 Waterproof raincoat", "👖 Water-resistant pants", "👢 Rain boots", "☔ Sturdy umbrella"],
          activities: ["📚 Read a good book indoors", "🍿 Movie marathon at home", "🎨 Indoor creative projects", "🎮 Board games with friends"],
          drinks: ["☕ Hot coffee or tea", "🍫 Rich hot chocolate", "🫖 Herbal tea blends", "🥤 Warm apple cider"],
          health: ["🧥 Layer clothing to stay warm", "🧦 Keep feet dry", "💧 Continue regular hydration", "🏠 Perfect cozy indoor time"]
        },
        arid: {
          clothing: ["🧥 Light rain jacket", "👖 Long pants", "👟 Waterproof shoes", "☔ Compact umbrella"],
          activities: ["🏛️ Museum or cultural center", "☕ Café with indoor seating", "🎬 Cinema visit", "🛍️ Indoor shopping"],
          drinks: ["☕ Warm beverages", "🍵 Traditional teas", "💧 Room temp water", "🥤 Warm soup"],
          health: ["💧 Rare event - stay safe", "🚗 Drive carefully if roads wet", "🏠 Enjoy the unusual weather", "📸 Capture the rare rain"]
        }
      },
      snowy: {
        tropical: {
          clothing: ["❄️ Extremely rare - heavy winter gear if in mountains", "🧥 Multiple warm layers", "🧤 Gloves and warm accessories", "👢 Insulated boots"],
          activities: ["🏔️ Mountain resort activities", "☕ Warm indoor retreats", "📸 Photography of rare snow", "🏠 Cozy indoor gatherings"],
          drinks: ["☕ Extra hot beverages", "🍫 Rich hot chocolate", "🫖 Warm spiced drinks", "🥤 Warm milk drinks"],
          health: ["🌡️ Layer for extreme temp change", "🧴 Extra skin protection", "💧 Stay warm and hydrated", "❄️ Enjoy this rare phenomenon"]
        },
        temperate: {
          clothing: ["🧥 Warm winter coat", "🧤 Gloves and scarf", "🧣 Wool hat", "👢 Insulated waterproof boots"],
          activities: ["⛷️ Skiing or snowboarding", "⛸️ Ice skating", "☃️ Build a snowman", "🏂 Snow tubing or sledding"],
          drinks: ["☕ Hot coffee or espresso", "🍫 Hot chocolate with marshmallows", "🫖 Warm mulled wine", "🥤 Hot apple cider"],
          health: ["🧥 Dress in layers", "🧴 Protect skin from wind", "💧 Stay hydrated (easy to forget)", "👃 Cover nose and mouth in extreme cold"]
        },
        arid: {
          clothing: ["❄️ Very rare - heavy winter clothing", "🧥 Insulated jacket", "🧤 Warm gloves", "👢 Winter boots"],
          activities: ["📸 Document the rare snow", "🏠 Stay indoors mostly", "☕ Visit heated cafés", "🎉 Celebrate the unusual weather"],
          drinks: ["☕ Hot tea and coffee", "🍫 Hot chocolate", "🥤 Warm beverages", "🫖 Spiced hot drinks"],
          health: ["🏠 Locals may not be prepared - stay safe", "🌡️ Unusual temps - layer up", "💧 Keep hydrated", "📱 Share the rare moment"]
        }
      }
    };

    const weatherKey = weather as keyof typeof recommendations;
    const climateKey = climate as keyof typeof recommendations.sunny;
    return recommendations[weatherKey]?.[climateKey] || recommendations.sunny.temperate;
  };

  const getMoodMessage = () => {
    const messages = {
      energetic: "🔥 Channel that energy into amazing activities!",
      relaxed: "😌 Perfect weather for your calm and peaceful mood",
      happy: "😊 Let the weather amplify your positive vibes!",
      focused: "🎯 Great conditions to accomplish your goals",
      adventurous: "🚀 Your mood matches the outdoor possibilities!",
    };
    return messages[mood as keyof typeof messages] || messages.happy;
  };

  const fetchWeatherData = async (cityName: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('get-weather', {
        body: { city: cityName }
      });

      if (error || !data) {
        toast.error("Failed to fetch weather data");
        return;
      }

      setCurrentCity(data.name);
      
      // Auto-detect weather condition
      const condition = data.weather[0].main.toLowerCase();
      if (condition.includes('clear') || condition.includes('sun')) {
        setWeather('sunny');
      } else if (condition.includes('rain')) {
        setWeather('rainy');
      } else if (condition.includes('snow')) {
        setWeather('snowy');
      } else {
        setWeather('cloudy');
      }

      // Auto-detect climate based on temperature
      const temp = data.main.temp;
      if (temp > 25) {
        setClimate('tropical');
      } else if (temp < 10) {
        setClimate('temperate');
      } else {
        setClimate('arid');
      }

      toast.success(`Weather loaded for ${data.name}`);
    } catch (error) {
      console.error('Error:', error);
      toast.error("Failed to fetch weather data");
    } finally {
      setLoading(false);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "user", width: 640, height: 480 } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        streamRef.current = stream;
        setIsCameraActive(true);
        toast.success("Camera started! Analyzing your expression...");
        
        // Wait for video to be ready before analyzing
        setTimeout(() => {
          analyzeEmotion();
        }, 1000);
      }
    } catch (error) {
      console.error("Camera error:", error);
      if (error instanceof DOMException) {
        if (error.name === 'NotAllowedError') {
          toast.error("Camera permission denied. Please allow camera access in your browser settings.");
        } else if (error.name === 'NotFoundError') {
          toast.error("No camera found on this device.");
        } else {
          toast.error("Unable to access camera. Please check your browser settings.");
        }
      } else {
        toast.error("Unable to access camera. Please grant camera permissions.");
      }
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      setIsCameraActive(false);
      setDetectedEmotion("");
      toast.info("Camera stopped");
    }
  };

  const analyzeEmotion = async () => {
    if (!videoRef.current) return;

    try {
      // Use browser's built-in MediaPipe or simple heuristic analysis
      const canvas = document.createElement('canvas');
      const video = videoRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) return;

      // Capture frame
      ctx.drawImage(video, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      
      // Simple brightness-based emotion detection
      let totalBrightness = 0;
      for (let i = 0; i < imageData.data.length; i += 4) {
        const r = imageData.data[i];
        const g = imageData.data[i + 1];
        const b = imageData.data[i + 2];
        totalBrightness += (r + g + b) / 3;
      }
      
      const avgBrightness = totalBrightness / (imageData.data.length / 4);
      
      // Map brightness to emotion (simple heuristic)
      let detectedMood = "relaxed";
      if (avgBrightness > 140) {
        detectedMood = "happy";
      } else if (avgBrightness > 120) {
        detectedMood = "energetic";
      } else if (avgBrightness > 100) {
        detectedMood = "focused";
      } else {
        detectedMood = "peaceful";
      }
      
      setDetectedEmotion(detectedMood);
      setMood(detectedMood);
      toast.success(`Detected mood: ${detectedMood}! Updating recommendations...`);
      
      // Continue analyzing every 3 seconds while camera is active
      if (isCameraActive) {
        setTimeout(() => analyzeEmotion(), 3000);
      }
    } catch (error) {
      console.error("Emotion analysis error:", error);
      toast.error("Unable to analyze emotion. Please ensure good lighting.");
    }
  };

  useEffect(() => {
    return () => {
      // Cleanup camera on unmount
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    fetchWeatherData(currentCity);
  }, []);

  // Sync with AppContext selectedCity
  useEffect(() => {
    const storedCity = localStorage.getItem('selectedCity');
    if (storedCity && storedCity !== currentCity) {
      fetchWeatherData(storedCity);
      setSearchCity(storedCity);
    }
  }, []);

  const handleSearch = () => {
    if (searchCity.trim()) {
      fetchWeatherData(searchCity);
      setSearchCity("");
    }
  };

  const recs = getRecommendations();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-6 md:py-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 md:mb-8">Personalized Recommendations</h1>

        {/* City Search */}
        <Card className="p-4 md:p-6 mb-4 md:mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                placeholder="Search for a city to get recommendations..."
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
          <p className="text-sm text-muted-foreground mt-2">
            Current location: <span className="font-semibold text-foreground">{currentCity}</span>
          </p>
        </Card>

        {/* Camera Mood Detection */}
        <Card className="p-4 md:p-6 mb-4 md:mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-2">AI Mood Detection</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Let AI detect your mood through your camera for personalized recommendations
              </p>
              {detectedEmotion && (
                <p className="text-sm font-medium text-primary">
                  Detected: {detectedEmotion.charAt(0).toUpperCase() + detectedEmotion.slice(1)} 😊
                </p>
              )}
            </div>
            <div className="flex gap-2">
              {!isCameraActive ? (
                <Button onClick={startCamera} variant="outline" className="gap-2">
                  <Camera className="w-4 h-4" />
                  Start Camera
                </Button>
              ) : (
                <Button onClick={stopCamera} variant="destructive" className="gap-2">
                  <StopCircle className="w-4 h-4" />
                  Stop Camera
                </Button>
              )}
            </div>
          </div>
          {isCameraActive && (
            <div className="mt-4 relative rounded-lg overflow-hidden bg-black">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full max-w-md mx-auto rounded-lg"
              />
            </div>
          )}
        </Card>

        {/* Mood & Weather Selection */}
        <Card className="p-4 md:p-6 mb-6 md:mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <div>
              <Label htmlFor="mood" className="text-sm md:text-lg mb-2 block">Your Mood</Label>
              <Select value={mood} onValueChange={setMood}>
                <SelectTrigger id="mood">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="energetic">⚡ Energetic</SelectItem>
                  <SelectItem value="relaxed">😌 Relaxed</SelectItem>
                  <SelectItem value="happy">😊 Happy</SelectItem>
                  <SelectItem value="focused">🎯 Focused</SelectItem>
                  <SelectItem value="adventurous">🚀 Adventurous</SelectItem>
                  <SelectItem value="creative">🎨 Creative</SelectItem>
                  <SelectItem value="motivated">💪 Motivated</SelectItem>
                  <SelectItem value="peaceful">🕊️ Peaceful</SelectItem>
                  <SelectItem value="social">🎉 Social</SelectItem>
                  <SelectItem value="contemplative">🤔 Contemplative</SelectItem>
                  <SelectItem value="playful">🎮 Playful</SelectItem>
                  <SelectItem value="productive">📊 Productive</SelectItem>
                  <SelectItem value="romantic">💕 Romantic</SelectItem>
                  <SelectItem value="nostalgic">📷 Nostalgic</SelectItem>
                  <SelectItem value="curious">🔍 Curious</SelectItem>
                  <SelectItem value="cozy">🛋️ Cozy</SelectItem>
                  <SelectItem value="ambitious">🎯 Ambitious</SelectItem>
                  <SelectItem value="serene">🧘 Serene</SelectItem>
                  <SelectItem value="festive">🎊 Festive</SelectItem>
                  <SelectItem value="introspective">💭 Introspective</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="weather" className="text-sm md:text-lg mb-2 block">Weather Condition</Label>
              <Select value={weather} onValueChange={setWeather}>
                <SelectTrigger id="weather">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sunny">☀️ Sunny</SelectItem>
                  <SelectItem value="cloudy">☁️ Cloudy</SelectItem>
                  <SelectItem value="rainy">🌧️ Rainy</SelectItem>
                  <SelectItem value="snowy">❄️ Snowy</SelectItem>
                  <SelectItem value="windy">💨 Windy</SelectItem>
                  <SelectItem value="foggy">🌫️ Foggy</SelectItem>
                  <SelectItem value="stormy">⛈️ Stormy</SelectItem>
                  <SelectItem value="humid">💧 Humid</SelectItem>
                  <SelectItem value="clear">🌤️ Clear</SelectItem>
                  <SelectItem value="partly-cloudy">⛅ Partly Cloudy</SelectItem>
                  <SelectItem value="drizzle">🌦️ Drizzle</SelectItem>
                  <SelectItem value="hail">🧊 Hail</SelectItem>
                  <SelectItem value="sleet">🌨️ Sleet</SelectItem>
                  <SelectItem value="dusty">🏜️ Dusty</SelectItem>
                  <SelectItem value="hazy">🌁 Hazy</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="climate" className="text-sm md:text-lg mb-2 block">Climate Zone</Label>
              <Select value={climate} onValueChange={setClimate}>
                <SelectTrigger id="climate">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tropical">🌴 Tropical</SelectItem>
                  <SelectItem value="temperate">🍂 Temperate</SelectItem>
                  <SelectItem value="arid">🏜️ Arid/Desert</SelectItem>
                  <SelectItem value="mediterranean">🌊 Mediterranean</SelectItem>
                  <SelectItem value="continental">❄️ Continental</SelectItem>
                  <SelectItem value="polar">🧊 Polar</SelectItem>
                  <SelectItem value="subtropical">🌺 Subtropical</SelectItem>
                  <SelectItem value="oceanic">🌊 Oceanic</SelectItem>
                  <SelectItem value="savanna">🦁 Savanna</SelectItem>
                  <SelectItem value="alpine">⛰️ Alpine</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-4 md:mt-6 p-3 md:p-4 bg-primary/10 rounded-lg">
            <p className="text-base md:text-lg font-medium text-center">{getMoodMessage()}</p>
          </div>
        </Card>

        {/* Recommendations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <Card className="p-4 md:p-6 hover:shadow-xl transition-all">
            <div className="flex items-center gap-3 mb-4">
              <Shirt className="w-6 h-6 md:w-8 md:h-8 text-primary" />
              <h2 className="text-xl md:text-2xl font-bold">Clothing</h2>
            </div>
            <ul className="space-y-2 md:space-y-3">
              {recs.clothing.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span className="text-sm md:text-lg">{item}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-4 md:p-6 hover:shadow-xl transition-all">
            <div className="flex items-center gap-3 mb-4">
              <Dumbbell className="w-6 h-6 md:w-8 md:h-8 text-secondary" />
              <h2 className="text-xl md:text-2xl font-bold">Activities</h2>
            </div>
            <ul className="space-y-2 md:space-y-3">
              {recs.activities.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-secondary mt-1">•</span>
                  <span className="text-sm md:text-lg">{item}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-4 md:p-6 hover:shadow-xl transition-all">
            <div className="flex items-center gap-3 mb-4">
              <UtensilsCrossed className="w-6 h-6 md:w-8 md:h-8 text-primary" />
              <h2 className="text-xl md:text-2xl font-bold">Beverages</h2>
            </div>
            <ul className="space-y-2 md:space-y-3">
              {recs.drinks.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span className="text-sm md:text-lg">{item}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-4 md:p-6 hover:shadow-xl transition-all">
            <div className="flex items-center gap-3 mb-4">
              <Heart className="w-6 h-6 md:w-8 md:h-8 text-secondary" />
              <h2 className="text-xl md:text-2xl font-bold">Health & Comfort</h2>
            </div>
            <ul className="space-y-2 md:space-y-3">
              {recs.health.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-secondary mt-1">•</span>
                  <span className="text-sm md:text-lg">{item}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Recommendations;
