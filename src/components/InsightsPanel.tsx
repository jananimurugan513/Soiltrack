import React from 'react';
import { AnalysisResult } from '../types';
import { AlertTriangle, Lightbulb, TrendingUp, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

interface InsightsPanelProps {
  insights: AnalysisResult['aiInsights'];
}

export const InsightsPanel: React.FC<InsightsPanelProps> = ({ insights }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="w-4 h-4 text-red-400" />;
      case 'tip': return <Lightbulb className="w-4 h-4 text-cyan-400" />;
      case 'insight': return <TrendingUp className="w-4 h-4 text-blue-400" />;
      default: return <Lightbulb className="w-4 h-4 text-cyan-400" />;
    }
  };

  const getBg = (type: string) => {
    switch (type) {
      case 'warning': return 'bg-red-950/20 border-red-500/20';
      case 'tip': return 'bg-cyan-950/20 border-cyan-500/20';
      case 'insight': return 'bg-blue-950/20 border-blue-500/20';
      default: return 'bg-stone-900 border-stone-800';
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-sm font-bold text-stone-500 uppercase tracking-widest">AI Insights & Alerts</h2>
      
      <div className="space-y-4">
        {insights.map((insight, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`p-4 rounded-2xl border ${getBg(insight.type)} space-y-2 group cursor-pointer hover:border-cyan-500/30 transition-all`}
          >
            <div className="flex items-center gap-2">
              {getIcon(insight.type)}
              <h4 className="text-xs font-bold text-stone-200 uppercase tracking-wider">{insight.title}</h4>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed">{insight.description}</p>
            <div className="flex items-center justify-between pt-2">
              <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">{insight.impact}</span>
              <ChevronRight className="w-3 h-3 text-stone-600 group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Stats Card */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 text-white space-y-4 group hover:border-cyan-500/30 transition-colors">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-cyan-400" />
          <h4 className="text-xs font-bold uppercase tracking-widest">Yield Prediction</h4>
        </div>
        <div className="space-y-1">
          <p className="text-3xl font-bold text-white">+24%</p>
          <p className="text-[10px] text-stone-500 font-bold uppercase tracking-widest">Potential Increase</p>
        </div>
        <p className="text-[10px] text-stone-400 leading-relaxed italic">"By following the recommended NPK balance and irrigation timing, your field could see a significant yield boost."</p>
      </div>
    </div>
  );
};
