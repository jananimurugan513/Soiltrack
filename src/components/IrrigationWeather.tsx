import React from 'react';
import { WeatherDay, Recommendation } from '../types';
import { Sun, Cloud, CloudRain, CloudLightning, Droplets, Clock } from 'lucide-react';

interface IrrigationWeatherProps {
  weather: WeatherDay[];
  recommendation: Recommendation;
}

export const IrrigationWeather: React.FC<IrrigationWeatherProps> = ({ weather, recommendation }) => {
  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'Sunny': return <Sun className="w-5 h-5 text-orange-400" />;
      case 'Cloudy': return <Cloud className="w-5 h-5 text-stone-400" />;
      case 'Rainy': return <CloudRain className="w-5 h-5 text-blue-400" />;
      case 'Stormy': return <CloudLightning className="w-5 h-5 text-purple-400" />;
      default: return <Sun className="w-5 h-5 text-orange-400" />;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Irrigation Schedule */}
      <div className="bg-stone-900 p-6 rounded-2xl border border-stone-800 shadow-sm group hover:border-cyan-500/30 transition-colors">
        <h3 className="text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-6">Irrigation Schedule</h3>
        <div className="relative pl-8 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-cyan-900/30">
          {recommendation.irrigation.timeline.map((item, i) => (
            <div key={i} className="relative">
              <div className="absolute -left-8 top-1 w-4 h-4 rounded-full bg-stone-950 border-2 border-cyan-500 z-10" />
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-bold text-stone-200 uppercase tracking-wider">{item.time}</p>
                  <p className="text-xs text-stone-500 mt-0.5">{item.action}</p>
                </div>
                <div className="flex items-center gap-1.5 bg-cyan-950/50 px-2 py-1 rounded text-[10px] font-bold text-cyan-400 border border-cyan-500/20">
                  <Droplets className="w-3 h-3" />
                  {recommendation.irrigation.amount}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weather Forecast */}
      <div className="bg-stone-900 p-6 rounded-2xl border border-stone-800 shadow-sm group hover:border-cyan-500/30 transition-colors">
        <h3 className="text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-6">7-Day Weather Forecast</h3>
        <div className="flex justify-between">
          {weather.map((day, i) => (
            <div key={i} className="flex flex-col items-center gap-3">
              <span className="text-[10px] font-bold text-stone-500 uppercase">{day.day}</span>
              <div className="w-10 h-10 rounded-full bg-stone-950 flex items-center justify-center border border-stone-800">
                {getWeatherIcon(day.condition)}
              </div>
              <div className="text-center">
                <p className="text-xs font-bold text-stone-200">{day.temp}°</p>
                <p className="text-[10px] text-cyan-400 font-bold">{day.rainfall}mm</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
