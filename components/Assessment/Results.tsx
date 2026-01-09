
import React from 'react';
import { motion } from 'framer-motion';
import { AssessmentResult } from '../../types';
import RadarChart from './RadarChart';
// Fixed: Ensured Sparkles and other icons are imported correctly
import { Download, ChevronRight, Lightbulb, Trophy, Share2, Home, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ResultsProps {
  result: AssessmentResult;
  isDarkMode: boolean;
}

const Results: React.FC<ResultsProps> = ({ result, isDarkMode }) => {
  const navigate = useNavigate();

  return (
    <div className="py-12 px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto space-y-12"
      >
        {/* Header Hero */}
        <section className="relative p-12 md:p-20 rounded-[4rem] glass-card border border-white/10 shadow-2xl overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-10">
             <RadarChart scores={result.scores} />
          </div>
          <div className="relative z-10 text-center md:text-left">
            <div className="inline-block px-4 py-1 rounded-full bg-orange-500/10 text-orange-500 font-black text-[10px] uppercase tracking-widest mb-6 border border-orange-500/20">
              Profile Generated Successfully
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter leading-none">
              The <span className="text-orange-500">{result.profileLabel}</span>
            </h1>
            <div className="flex flex-wrap items-center gap-6 justify-center md:justify-start">
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase opacity-40">Profile Code</span>
                <span className="text-4xl font-black text-orange-500">{result.profileCode}</span>
              </div>
              <div className="h-12 w-px bg-white/10 hidden md:block"></div>
              <p className="max-w-lg text-xl opacity-70 font-medium">
                {result.profileDescription}
              </p>
            </div>
          </div>
        </section>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Chart Section */}
          <div className="glass-card p-12 rounded-[3.5rem] border border-white/10">
            <h2 className="text-3xl font-black mb-8 flex items-center gap-3">
              <Trophy className="text-orange-500" /> Cognitive Map
            </h2>
            <RadarChart scores={result.scores} />
            <div className="mt-8 space-y-4">
               {/* Fixed: Cast Object.entries to avoid 'unknown' type error in strict TypeScript */}
               {(Object.entries(result.scores) as [string, number][]).map(([key, val]) => (
                 <div key={key} className="flex items-center justify-between">
                   <span className="text-sm font-bold uppercase tracking-widest opacity-50">{key}</span>
                   <div className="flex items-center gap-3">
                      <span className={`text-xs font-black ${val >= 0 ? 'text-orange-500' : 'text-blue-400'}`}>
                        {val >= 0 ? 'Pole 1' : 'Pole 2'}
                      </span>
                      <div className="w-32 h-2 bg-white/5 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-orange-500" 
                          style={{ width: `${Math.abs(val) * 20}%`, marginLeft: val >= 0 ? '50%' : `${50 - Math.abs(val) * 10}%` }}
                        ></div>
                      </div>
                   </div>
                 </div>
               ))}
            </div>
          </div>

          {/* Recommendations */}
          <div className="space-y-8">
            <div className="glass-card p-12 rounded-[3.5rem] border border-white/10 bg-orange-500/5">
              <h2 className="text-3xl font-black mb-8 flex items-center gap-3">
                <Lightbulb className="text-orange-500" /> Strategic Tips
              </h2>
              <div className="space-y-4">
                {result.recommendations.map((rec, i) => (
                  <div key={i} className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-orange-500/10 hover:border-orange-500/20 transition-all group">
                    <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-500 flex items-center justify-center font-black group-hover:scale-110 transition-transform">
                      {i + 1}
                    </div>
                    <p className="font-bold text-lg opacity-80">{rec}</p>
                  </div>
                ))}
              </div>
            </div>

            {result.contextInsights.length > 0 && (
              <div className="glass-card p-10 rounded-[3rem] border border-orange-500/20 bg-orange-500/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-5">
                   <Sparkles size={60} />
                </div>
                <h3 className="text-xl font-black mb-4 flex items-center gap-2">
                   <Sparkles className="text-orange-500" size={20} /> Dr. Fox's Insights
                </h3>
                <ul className="space-y-3">
                  {result.contextInsights.map((ins, i) => (
                    <li key={i} className="text-sm font-medium opacity-70 italic leading-relaxed">
                       "{ins}"
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-center py-8">
           <button 
             onClick={() => window.print()}
             className="px-10 py-4 bg-orange-500 text-white rounded-[2rem] font-black shadow-xl shadow-orange-500/20 flex items-center gap-2 hover:scale-105 active:scale-95 transition-all"
           >
             <Download size={20} /> Download PDF Report
           </button>
           <button className="px-10 py-4 bg-white/5 border border-white/10 rounded-[2rem] font-black flex items-center gap-2 hover:bg-white/10 transition-all">
             <Share2 size={20} /> Share Result
           </button>
           <button 
             onClick={() => navigate('/')}
             className="px-10 py-4 border-2 border-orange-500 text-orange-500 rounded-[2rem] font-black flex items-center gap-2 hover:bg-orange-500 hover:text-white transition-all"
           >
             <Home size={20} /> Enter Dashboard
           </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Results;
