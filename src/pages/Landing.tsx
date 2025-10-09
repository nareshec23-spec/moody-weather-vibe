import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Cloud, Sparkles, Heart, TrendingUp } from "lucide-react";
import heroImage from "@/assets/hero-weather.jpg";

const Landing = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        className="relative h-screen flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(14, 165, 233, 0.7), rgba(14, 165, 233, 0.5)), url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/20 to-background" />
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto animate-fade-in">
          <Cloud className="w-20 h-20 mx-auto mb-6 text-white drop-shadow-lg" />
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white drop-shadow-lg">
            Weather Meets Emotion
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90 drop-shadow">
            Personalized weather insights and recommendations tailored to your mood and lifestyle
          </p>
          <Link to="/dashboard">
            <Button size="lg" className="text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all">
              Get Started
              <Sparkles className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold text-center mb-12">
            Everything You Need for Weather-Smart Living
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card p-8 rounded-xl shadow-lg hover:shadow-xl transition-all border border-border">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Cloud className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Accurate Forecasts</h3>
              <p className="text-muted-foreground">
                Get real-time weather data and 5-day forecasts for cities worldwide with precise metrics
              </p>
            </div>

            <div className="bg-card p-8 rounded-xl shadow-lg hover:shadow-xl transition-all border border-border">
              <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
                <Heart className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Mood-Based Insights</h3>
              <p className="text-muted-foreground">
                Receive personalized recommendations for clothing, activities, and drinks based on weather and your mood
              </p>
            </div>

            <div className="bg-card p-8 rounded-xl shadow-lg hover:shadow-xl transition-all border border-border">
              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                <TrendingUp className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Climate-Aware</h3>
              <p className="text-muted-foreground">
                Get climate-specific suggestions that adapt to different cities and weather patterns
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
