import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navbar from "@/components/Navbar";
import { Shirt, UtensilsCrossed, Heart, Dumbbell, Sun, CloudRain, Snowflake, Cloud } from "lucide-react";

const Recommendations = () => {
  const [mood, setMood] = useState("energetic");
  const [weather, setWeather] = useState("sunny");
  const [climate, setClimate] = useState("temperate");

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

  const recs = getRecommendations();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Personalized Recommendations</h1>

        {/* Mood & Weather Selection */}
        <Card className="p-6 mb-8">
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <Label htmlFor="mood" className="text-lg mb-2 block">Your Mood</Label>
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
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="weather" className="text-lg mb-2 block">Weather Condition</Label>
              <Select value={weather} onValueChange={setWeather}>
                <SelectTrigger id="weather">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sunny">☀️ Sunny</SelectItem>
                  <SelectItem value="cloudy">☁️ Cloudy</SelectItem>
                  <SelectItem value="rainy">🌧️ Rainy</SelectItem>
                  <SelectItem value="snowy">❄️ Snowy</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="climate" className="text-lg mb-2 block">Climate Zone</Label>
              <Select value={climate} onValueChange={setClimate}>
                <SelectTrigger id="climate">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tropical">🌴 Tropical</SelectItem>
                  <SelectItem value="temperate">🍂 Temperate</SelectItem>
                  <SelectItem value="arid">🏜️ Arid/Desert</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-6 p-4 bg-primary/10 rounded-lg">
            <p className="text-lg font-medium text-center">{getMoodMessage()}</p>
          </div>
        </Card>

        {/* Recommendations Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6 hover:shadow-xl transition-all">
            <div className="flex items-center gap-3 mb-4">
              <Shirt className="w-8 h-8 text-primary" />
              <h2 className="text-2xl font-bold">Clothing</h2>
            </div>
            <ul className="space-y-3">
              {recs.clothing.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span className="text-lg">{item}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-6 hover:shadow-xl transition-all">
            <div className="flex items-center gap-3 mb-4">
              <Dumbbell className="w-8 h-8 text-secondary" />
              <h2 className="text-2xl font-bold">Activities</h2>
            </div>
            <ul className="space-y-3">
              {recs.activities.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-secondary mt-1">•</span>
                  <span className="text-lg">{item}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-6 hover:shadow-xl transition-all">
            <div className="flex items-center gap-3 mb-4">
              <UtensilsCrossed className="w-8 h-8 text-primary" />
              <h2 className="text-2xl font-bold">Beverages</h2>
            </div>
            <ul className="space-y-3">
              {recs.drinks.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span className="text-lg">{item}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-6 hover:shadow-xl transition-all">
            <div className="flex items-center gap-3 mb-4">
              <Heart className="w-8 h-8 text-secondary" />
              <h2 className="text-2xl font-bold">Health & Comfort</h2>
            </div>
            <ul className="space-y-3">
              {recs.health.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-secondary mt-1">•</span>
                  <span className="text-lg">{item}</span>
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
