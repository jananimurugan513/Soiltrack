import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { Recommendation } from '../types';
import * as Icons from 'lucide-react';

interface TopOverviewProps {
  recommendations: Recommendation[];
}

export const TopOverview: React.FC<TopOverviewProps> = ({ recommendations }) => {
  const bestCrop = recommendations[0];
  
  const yieldData = [
    { name: 'Expected', value: bestCrop.expectedYield },
    { name: 'Target', value: bestCrop.expectedYield * 1.2 },
  ];

  const getIcon = (name: string) => {
    const Icon = (Icons as any)[name] || Icons.Sprout;
    return <Icon className="w-5 h-5" />;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Expected Yield Gauge */}
      <div className="lg:col-span-3 bg-stone-900 p-6 rounded-2xl border border-stone-800 shadow-sm flex flex-col items-center justify-center text-center group hover:border-cyan-500/30 transition-colors">
        <h3 className="text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-4">Expected Yield</h3>
        <div className="relative w-32 h-32">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={[{ value: bestCrop.expectedYield }, { value: 10 - bestCrop.expectedYield }]}
                cx="50%" cy="50%"
                innerRadius={45} outerRadius={60}
                startAngle={180} endAngle={0}
                dataKey="value"
                stroke="none"
              >
                <Cell fill="#22d3ee" /> {/* cyan-400 */}
                <Cell fill="#1c1917" /> {/* stone-900 */}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pt-6">
            <span className="text-2xl font-bold text-white">{bestCrop.expectedYield}</span>
            <span className="text-[10px] text-stone-500 font-bold uppercase">Tons/Ha</span>
          </div>
        </div>
        <p className="text-xs text-cyan-400 font-bold mt-2">+12% vs last season</p>
      </div>

      {/* Best Crops Recommended */}
      <div className="lg:col-span-5 bg-stone-900 p-6 rounded-2xl border border-stone-800 shadow-sm group hover:border-cyan-500/30 transition-colors">
        <h3 className="text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-4">Best Crops Recommended</h3>
        <div className="grid grid-cols-3 gap-4">
          {recommendations.map((rec, i) => (
            <div key={i} className="flex flex-col items-center p-3 rounded-xl bg-stone-950 border border-stone-800 group hover:border-cyan-500/50 transition-colors cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-stone-900 shadow-sm flex items-center justify-center text-cyan-400 mb-2 group-hover:scale-110 transition-transform border border-cyan-500/20">
                {getIcon(rec.icon)}
              </div>
              <span className="text-xs font-bold text-stone-200">{rec.crop}</span>
              <span className="text-[10px] text-cyan-400 font-bold">{rec.suitabilityScore}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Fertilizer Plan */}
      <div className="lg:col-span-4 bg-stone-900 p-6 rounded-2xl border border-stone-800 shadow-sm group hover:border-cyan-500/30 transition-colors">
        <h3 className="text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-4">Fertilizer Plan</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-2 rounded-lg bg-cyan-950/30 border border-cyan-500/20">
            <div className="w-8 h-8 rounded-lg bg-stone-900 flex items-center justify-center text-cyan-400 border border-cyan-500/20">
              <Icons.FlaskConical className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-cyan-300 uppercase tracking-wider">{bestCrop.fertilizer.type}</p>
              <p className="text-[10px] text-cyan-500 font-medium">{bestCrop.fertilizer.dosage}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-2 rounded-lg bg-stone-950 border border-stone-800">
            <div className="w-8 h-8 rounded-lg bg-stone-900 flex items-center justify-center text-stone-500">
              <Icons.Calendar className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Schedule</p>
              <p className="text-[10px] text-stone-500 font-medium truncate max-w-[150px]">{bestCrop.fertilizer.schedule}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
