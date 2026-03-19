import React from 'react';
import { motion } from 'motion/react';
import { Recommendation } from '../types';
import { AlertTriangle, CheckCircle2, Droplets, FlaskConical, Calendar, Info } from 'lucide-react';

interface RecommendationCardProps {
  recommendation: Recommendation;
  index: number;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({ recommendation, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-3xl p-8 shadow-sm border border-stone-100 space-y-6"
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-2xl font-serif italic text-stone-900">{recommendation.crop}</h3>
          <p className="text-sm text-stone-500 mt-1">Expected Yield: {recommendation.expectedYield}</p>
        </div>
        <div className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full text-sm font-semibold">
          {recommendation.suitabilityScore}% Match
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Fertilizer Section */}
        <div className="space-y-4 p-5 bg-stone-50 rounded-2xl">
          <div className="flex items-center gap-2 text-stone-800 font-semibold">
            <FlaskConical className="w-5 h-5 text-emerald-600" />
            Fertilizer Plan
          </div>
          <div className="space-y-2">
            <p className="text-sm text-stone-600"><span className="font-medium">Type:</span> {recommendation.fertilizer.type}</p>
            <p className="text-sm text-stone-600"><span className="font-medium">Dosage:</span> {recommendation.fertilizer.dosage}</p>
            <div className="flex items-start gap-2 mt-2">
              <Calendar className="w-4 h-4 text-stone-400 mt-0.5" />
              <p className="text-xs text-stone-500 italic">{recommendation.fertilizer.schedule}</p>
            </div>
          </div>
        </div>

        {/* Irrigation Section */}
        <div className="space-y-4 p-5 bg-blue-50/50 rounded-2xl">
          <div className="flex items-center gap-2 text-stone-800 font-semibold">
            <Droplets className="w-5 h-5 text-blue-500" />
            Irrigation Schedule
          </div>
          <div className="space-y-2">
            <p className="text-sm text-stone-600"><span className="font-medium">Frequency:</span> {recommendation.irrigation.frequency}</p>
            <p className="text-sm text-stone-600"><span className="font-medium">Method:</span> {recommendation.irrigation.method}</p>
            <p className="text-xs text-stone-500 italic mt-2">{recommendation.irrigation.notes}</p>
          </div>
        </div>
      </div>

      {/* Warnings & Alternatives */}
      <div className="space-y-4">
        {recommendation.warnings.length > 0 && (
          <div className="flex gap-3 p-4 bg-orange-50 rounded-2xl border border-orange-100">
            <AlertTriangle className="w-5 h-5 text-orange-500 shrink-0" />
            <div className="space-y-1">
              <p className="text-sm font-semibold text-orange-800">Risk Alerts</p>
              <ul className="text-xs text-orange-700 list-disc list-inside space-y-1">
                {recommendation.warnings.map((w, i) => <li key={i}>{w}</li>)}
              </ul>
            </div>
          </div>
        )}

        <div className="flex gap-3 p-4 bg-stone-50 rounded-2xl">
          <Info className="w-5 h-5 text-stone-400 shrink-0" />
          <div className="space-y-1">
            <p className="text-sm font-semibold text-stone-800">Alternative Options</p>
            <p className="text-xs text-stone-600">{recommendation.alternatives.join(', ')}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
