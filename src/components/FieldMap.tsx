import React from 'react';
import { HeatmapPoint } from '../types';
import { motion } from 'motion/react';

interface FieldMapProps {
  data: HeatmapPoint[];
}

export const FieldMap: React.FC<FieldMapProps> = ({ data }) => {
  const getColor = (value: number) => {
    if (value > 80) return 'bg-cyan-500';
    if (value > 60) return 'bg-cyan-400';
    if (value > 40) return 'bg-cyan-300';
    if (value > 20) return 'bg-cyan-200';
    return 'bg-cyan-100';
  };

  return (
    <div className="bg-stone-900 p-6 rounded-2xl border border-stone-800 shadow-sm h-full group hover:border-cyan-500/30 transition-colors">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">Field Heatmap / Crop Plan</h3>
        <div className="flex gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-cyan-500" />
            <span className="text-[10px] font-bold text-stone-500 uppercase">Optimal</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-cyan-100" />
            <span className="text-[10px] font-bold text-stone-500 uppercase">Low</span>
          </div>
        </div>
      </div>

      <div className="relative aspect-video bg-stone-950 rounded-xl overflow-hidden border border-stone-800">
        {/* Grid Overlay */}
        <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 gap-1 p-1">
          {data.map((point, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className={`${getColor(point.value)} rounded-lg relative group cursor-pointer hover:brightness-110 transition-all flex items-center justify-center`}
            >
              <span className="text-[10px] font-bold text-stone-950 opacity-0 group-hover:opacity-100 transition-opacity">{point.value}%</span>
              
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-20">
                <div className="bg-stone-950 text-white text-[10px] font-bold px-2 py-1 rounded whitespace-nowrap border border-cyan-500/30">
                  {point.label}: {point.value}%
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Satellite View Placeholder */}
        <div className="absolute inset-0 pointer-events-none opacity-20 mix-blend-overlay">
          <img 
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1000&auto=format&fit=crop" 
            alt="Field" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>
      
      <p className="text-[10px] text-stone-500 font-bold mt-4 uppercase tracking-wider text-center">Click zones for detailed soil analysis</p>
    </div>
  );
};
