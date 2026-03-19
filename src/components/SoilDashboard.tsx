import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { SoilData } from '../types';

interface SoilDashboardProps {
  data: SoilData;
  healthStatus: string;
}

export const SoilDashboard: React.FC<SoilDashboardProps> = ({ data, healthStatus }) => {
  const nutrientData = [
    { name: 'Nitrogen', value: data.nitrogen, color: '#10b981' },
    { name: 'Phosphorus', value: data.phosphorus, color: '#3b82f6' },
    { name: 'Potassium', value: data.potassium, color: '#f59e0b' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Excellent': return 'text-emerald-600 bg-emerald-50';
      case 'Good': return 'text-blue-600 bg-blue-50';
      case 'Fair': return 'text-orange-600 bg-orange-50';
      case 'Poor': return 'text-red-600 bg-red-50';
      default: return 'text-stone-600 bg-stone-50';
    }
  };

  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-stone-100 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-serif italic text-stone-900">Field Analysis Summary</h2>
          <p className="text-stone-500 text-sm">Real-time soil health and nutrient distribution</p>
        </div>
        <div className={`px-6 py-2 rounded-full text-sm font-bold ${getStatusColor(healthStatus)}`}>
          Soil Health: {healthStatus}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Nutrient Chart */}
        <div className="lg:col-span-2 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={nutrientData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
              <Tooltip 
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
              />
              <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={40}>
                {nutrientData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-stone-50 rounded-2xl text-center">
            <p className="text-xs text-stone-500 uppercase tracking-wider font-semibold">pH Level</p>
            <p className="text-2xl font-mono text-stone-900 mt-1">{data.ph}</p>
          </div>
          <div className="p-4 bg-stone-50 rounded-2xl text-center">
            <p className="text-xs text-stone-500 uppercase tracking-wider font-semibold">Moisture</p>
            <p className="text-2xl font-mono text-stone-900 mt-1">{data.moisture}%</p>
          </div>
          <div className="p-4 bg-stone-50 rounded-2xl text-center">
            <p className="text-xs text-stone-500 uppercase tracking-wider font-semibold">Temp</p>
            <p className="text-2xl font-mono text-stone-900 mt-1">{data.temperature}°C</p>
          </div>
          <div className="p-4 bg-stone-50 rounded-2xl text-center">
            <p className="text-xs text-stone-500 uppercase tracking-wider font-semibold">Rainfall</p>
            <p className="text-2xl font-mono text-stone-900 mt-1">{data.rainfall}mm</p>
          </div>
        </div>
      </div>
    </div>
  );
};
