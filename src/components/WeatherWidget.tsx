import { Cloud, CloudRain, Sun, Wind, Droplets, Eye, CloudSnow } from "lucide-react";
import { Badge } from "./ui/badge";
import { motion } from "motion/react";

interface WeatherWidgetProps {
  matchDate?: string;
  location?: string;
  showForecast?: boolean;
}

interface WeatherCondition {
  temp: number;
  condition: "sunny" | "cloudy" | "rainy" | "snowy";
  description: string;
  humidity: number;
  windSpeed: number;
  visibility: number;
  feelsLike: number;
  playability: "excellent" | "good" | "fair" | "poor";
}

interface ForecastDay {
  day: string;
  high: number;
  low: number;
  condition: "sunny" | "cloudy" | "rainy" | "snowy";
  precipChance: number;
}

export function WeatherWidget({ 
  matchDate = "Dec 22, 2024", 
  location = "Merion, PA",
  showForecast = false 
}: WeatherWidgetProps) {
  
  // Mock current weather
  const currentWeather: WeatherCondition = {
    temp: 68,
    condition: "sunny",
    description: "Partly Cloudy",
    humidity: 45,
    windSpeed: 8,
    visibility: 10,
    feelsLike: 66,
    playability: "excellent",
  };

  // Mock 5-day forecast
  const forecast: ForecastDay[] = [
    { day: "Mon", high: 70, low: 55, condition: "sunny", precipChance: 5 },
    { day: "Tue", high: 68, low: 54, condition: "cloudy", precipChance: 20 },
    { day: "Wed", high: 65, low: 52, condition: "rainy", precipChance: 70 },
    { day: "Thu", high: 72, low: 58, condition: "sunny", precipChance: 10 },
    { day: "Fri", high: 74, low: 60, condition: "sunny", precipChance: 5 },
  ];

  const getWeatherIcon = (condition: WeatherCondition["condition"]) => {
    switch (condition) {
      case "sunny": return Sun;
      case "cloudy": return Cloud;
      case "rainy": return CloudRain;
      case "snowy": return CloudSnow;
    }
  };

  const getConditionColor = (condition: WeatherCondition["condition"]) => {
    switch (condition) {
      case "sunny": return "from-amber-400 to-orange-500";
      case "cloudy": return "from-gray-400 to-gray-500";
      case "rainy": return "from-blue-400 to-blue-600";
      case "snowy": return "from-cyan-300 to-blue-400";
    }
  };

  const getPlayabilityColor = (playability: WeatherCondition["playability"]) => {
    switch (playability) {
      case "excellent": return "bg-green-100 text-green-700";
      case "good": return "bg-blue-100 text-blue-700";
      case "fair": return "bg-amber-100 text-amber-700";
      case "poor": return "bg-red-100 text-red-700";
    }
  };

  const WeatherIcon = getWeatherIcon(currentWeather.condition);

  if (!showForecast) {
    // Compact widget for match cards
    return (
      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getConditionColor(currentWeather.condition)} flex items-center justify-center`}>
              <WeatherIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold">{currentWeather.temp}°F</div>
              <div className="text-xs text-[var(--color-text-secondary)]">
                {currentWeather.description}
              </div>
            </div>
          </div>
          <Badge className={`${getPlayabilityColor(currentWeather.playability)} text-xs capitalize`}>
            {currentWeather.playability}
          </Badge>
        </div>
      </div>
    );
  }

  // Full weather screen
  return (
    <div className="space-y-4">
      {/* Current Weather Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-6 text-white shadow-lg"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-white/80 text-sm mb-1">{location}</p>
            <p className="text-white/70 text-xs">{matchDate}</p>
          </div>
          <Badge className={`${getPlayabilityColor(currentWeather.playability)}`}>
            {currentWeather.playability.toUpperCase()}
          </Badge>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="text-6xl font-bold mb-2">{currentWeather.temp}°</div>
            <div className="text-white/90 text-lg mb-1">{currentWeather.description}</div>
            <div className="text-white/70 text-sm">Feels like {currentWeather.feelsLike}°</div>
          </div>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className={`w-24 h-24 rounded-full bg-gradient-to-br ${getConditionColor(currentWeather.condition)} flex items-center justify-center`}
          >
            <WeatherIcon className="w-12 h-12 text-white" />
          </motion.div>
        </div>

        {/* Weather Details Grid */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
            <Droplets className="w-5 h-5 text-white mx-auto mb-1" />
            <div className="text-lg font-bold">{currentWeather.humidity}%</div>
            <div className="text-xs text-white/70">Humidity</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
            <Wind className="w-5 h-5 text-white mx-auto mb-1" />
            <div className="text-lg font-bold">{currentWeather.windSpeed} mph</div>
            <div className="text-xs text-white/70">Wind</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
            <Eye className="w-5 h-5 text-white mx-auto mb-1" />
            <div className="text-lg font-bold">{currentWeather.visibility} mi</div>
            <div className="text-xs text-white/70">Visibility</div>
          </div>
        </div>
      </motion.div>

      {/* 5-Day Forecast */}
      <div className="bg-[var(--color-bg-elevated)] rounded-2xl p-4">
        <h3 className="font-medium mb-3">5-Day Forecast</h3>
        <div className="space-y-2">
          {forecast.map((day, index) => {
            const DayIcon = getWeatherIcon(day.condition);
            return (
              <motion.div
                key={day.day}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors"
              >
                <div className="flex items-center gap-3 flex-1">
                  <span className="text-sm font-medium w-8">{day.day}</span>
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${getConditionColor(day.condition)} flex items-center justify-center`}>
                    <DayIcon className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-blue-500 h-1.5 rounded-full"
                        style={{ width: `${day.precipChance}%` }}
                      />
                    </div>
                    <span className="text-xs text-[var(--color-text-tertiary)] w-8">
                      {day.precipChance}%
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium">{day.high}°</span>
                  <span className="text-[var(--color-text-tertiary)]">{day.low}°</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Weather Advisory */}
      <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
        <div className="flex items-start gap-3">
          <Sun className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium mb-1 text-green-900">
              Excellent Playing Conditions
            </h3>
            <p className="text-sm text-green-700">
              Perfect weather for outdoor sports! Low chance of rain and comfortable temperatures expected.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
