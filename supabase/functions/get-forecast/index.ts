import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { city, lat, lon } = await req.json();
    const apiKey = Deno.env.get('OPENWEATHER_API_KEY');

    if (!apiKey) {
      console.error('OPENWEATHER_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let forecastUrl = '';
    if (lat && lon) {
      forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    } else if (city) {
      forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
    } else {
      return new Response(
        JSON.stringify({ error: 'City name or coordinates required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Fetching forecast for:', city || `${lat},${lon}`);
    const forecastResponse = await fetch(forecastUrl);

    if (!forecastResponse.ok) {
      console.error('OpenWeather API error:', forecastResponse.status);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch forecast data' }),
        { status: forecastResponse.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const forecastData = await forecastResponse.json();
    console.log('Forecast data fetched successfully');

    return new Response(
      JSON.stringify(forecastData),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in get-forecast function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
