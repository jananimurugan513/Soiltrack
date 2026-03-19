import React from 'react';
import { SoilData } from '../types';
import { FlaskConical, Droplets, MapPin, CloudSun, Sprout, ChevronRight } from 'lucide-react';

interface InputSectionProps {
  onAnalyze: (data: SoilData) => void;
  isLoading: boolean;
}

export const InputSection: React.FC<InputSectionProps> = ({ onAnalyze, isLoading }) => {
  const [formData, setFormData] = React.useState<SoilData>({
    ph: 6.5,
    moisture: 45,
    nitrogen: 60,
    phosphorus: 40,
    potassium: 50,
    temperature: 28,
    humidity: 65,
    rainfall: 120,
    location: 'Central Valley, CA',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'location' ? value : parseFloat(value) || 0 
    }));
  };

  return (
    <div className="bg-stone-900/30 border border-cyan-900/20 rounded-3xl p-6 lg:p-8 backdrop-blur-sm">
      <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center">
        <div className="flex-1 w-full space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-stone-500 uppercase tracking-widest">Field Data Inputs</h2>
            <div className="flex items-center gap-2 text-[10px] font-bold text-cyan-500/50 uppercase tracking-widest">
              <MapPin className="w-3 h-3" />
              {formData.location}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* pH Slider */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="flex items-center gap-2 text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                  <FlaskConical className="w-3 h-3 text-cyan-400" />
                  Soil pH
                </label>
                <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-950/50 px-2 py-0.5 rounded border border-cyan-500/20">{formData.ph}</span>
              </div>
              <input 
                type="range" 
                name="ph"
                min="0" max="14" step="0.1"
                value={formData.ph}
                onChange={handleChange}
                className="w-full h-1.5 bg-stone-950 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
            </div>

            {/* Moisture Slider */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="flex items-center gap-2 text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                  <Droplets className="w-3 h-3 text-cyan-400" />
                  Moisture %
                </label>
                <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-950/50 px-2 py-0.5 rounded border border-cyan-500/20">{formData.moisture}%</span>
              </div>
              <input 
                type="range" 
                name="moisture"
                min="0" max="100"
                value={formData.moisture}
                onChange={handleChange}
                className="w-full h-1.5 bg-stone-950 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
            </div>

            {/* Nutrients */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                <Sprout className="w-3 h-3 text-cyan-400" />
                Nutrients (N, P, K)
              </label>
              <div className="grid grid-cols-3 gap-2">
                <input 
                  type="number" name="nitrogen" value={formData.nitrogen} onChange={handleChange} placeholder="N"
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg px-2 py-1.5 text-xs text-center text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                />
                <input 
                  type="number" name="phosphorus" value={formData.phosphorus} onChange={handleChange} placeholder="P"
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg px-2 py-1.5 text-xs text-center text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                />
                <input 
                  type="number" name="potassium" value={formData.potassium} onChange={handleChange} placeholder="K"
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg px-2 py-1.5 text-xs text-center text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                />
              </div>
            </div>

            {/* Location Select */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                <MapPin className="w-3 h-3 text-cyan-400" />
                Region
              </label>
              <select 
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-1.5 text-xs text-white focus:ring-2 focus:ring-cyan-500 outline-none transition-all"
              >
                <option>Central Valley, CA</option>
                <option>Midwest Plains, IA</option>
                <option>Southern Delta, MS</option>
                <option>Custom Location</option>
              </select>
            </div>
          </div>
        </div>

        <button 
          onClick={() => onAnalyze(formData)}
          disabled={isLoading}
          className="w-full lg:w-auto bg-cyan-600 hover:bg-cyan-500 text-stone-950 font-bold px-8 py-4 rounded-2xl shadow-lg shadow-cyan-500/10 transition-all flex items-center justify-center gap-2 group disabled:opacity-50 whitespace-nowrap self-stretch lg:self-end"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-stone-950/30 border-t-stone-950 rounded-full animate-spin" />
          ) : (
            <>
              GET CROP PLAN
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
