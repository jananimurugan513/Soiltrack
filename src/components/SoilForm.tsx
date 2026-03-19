import React from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Thermometer, Droplets, FlaskConical, CloudRain, Sprout } from 'lucide-react';
import { SoilData } from '../types';

interface SoilFormProps {
  onSubmit: (data: SoilData) => void;
  isLoading: boolean;
}

export const SoilForm: React.FC<SoilFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = React.useState<SoilData>({
    ph: 6.5,
    moisture: 40,
    nitrogen: 50,
    phosphorus: 40,
    potassium: 40,
    temperature: 25,
    humidity: 60,
    rainfall: 100,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const onDrop = React.useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result as string;
      const lines = text.split('\n');
      if (lines.length > 1) {
        const values = lines[1].split(',');
        // Simple CSV mapping assumption: ph,moisture,n,p,k,temp,hum,rain
        if (values.length >= 8) {
          setFormData({
            ph: parseFloat(values[0]) || 6.5,
            moisture: parseFloat(values[1]) || 40,
            nitrogen: parseFloat(values[2]) || 50,
            phosphorus: parseFloat(values[3]) || 40,
            potassium: parseFloat(values[4]) || 40,
            temperature: parseFloat(values[5]) || 25,
            humidity: parseFloat(values[6]) || 60,
            rainfall: parseFloat(values[7]) || 100,
          });
        }
      }
    };
    reader.readAsText(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop, 
    accept: { 'text/csv': ['.csv'] },
    multiple: false 
  } as any);

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-3xl shadow-sm border border-stone-100">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Soil pH */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-stone-600">
            <FlaskConical className="w-4 h-4 text-emerald-600" />
            Soil pH
          </label>
          <input
            type="number"
            name="ph"
            step="0.1"
            value={formData.ph}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
          />
        </div>

        {/* Moisture */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-stone-600">
            <Droplets className="w-4 h-4 text-blue-500" />
            Moisture (%)
          </label>
          <input
            type="number"
            name="moisture"
            value={formData.moisture}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
          />
        </div>

        {/* NPK Nutrients */}
        <div className="space-y-2 md:col-span-2">
          <label className="flex items-center gap-2 text-sm font-medium text-stone-600 mb-2">
            <Sprout className="w-4 h-4 text-emerald-600" />
            Nutrients (N-P-K)
          </label>
          <div className="grid grid-cols-3 gap-4">
            <input
              type="number"
              name="nitrogen"
              placeholder="N"
              value={formData.nitrogen}
              onChange={handleChange}
              className="px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-emerald-500 outline-none"
            />
            <input
              type="number"
              name="phosphorus"
              placeholder="P"
              value={formData.phosphorus}
              onChange={handleChange}
              className="px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-emerald-500 outline-none"
            />
            <input
              type="number"
              name="potassium"
              placeholder="K"
              value={formData.potassium}
              onChange={handleChange}
              className="px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>
        </div>

        {/* Weather Data */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-stone-600">
            <Thermometer className="w-4 h-4 text-orange-500" />
            Temperature (°C)
          </label>
          <input
            type="number"
            name="temperature"
            value={formData.temperature}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-stone-600">
            <CloudRain className="w-4 h-4 text-blue-400" />
            Rainfall (mm)
          </label>
          <input
            type="number"
            name="rainfall"
            value={formData.rainfall}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>
      </div>

      <div className="relative">
        <div 
          {...getRootProps()} 
          className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors ${
            isDragActive ? 'border-emerald-500 bg-emerald-50' : 'border-stone-200 hover:border-emerald-400'
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="w-8 h-8 text-stone-400 mx-auto mb-3" />
          <p className="text-sm text-stone-500">
            {isDragActive ? 'Drop CSV here' : 'Drag & drop CSV data or click to upload'}
          </p>
          <p className="text-xs text-stone-400 mt-1">Format: ph, moisture, N, P, K, temp, hum, rain</p>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-4 rounded-2xl shadow-lg shadow-emerald-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          'Analyze Field Data'
        )}
      </button>
    </form>
  );
};
