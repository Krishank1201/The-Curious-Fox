
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Roadmap, RoadmapModule, updateRoadmapProgress } from '../../services/roadmapEngine';
import { AssessmentResult } from '../../types';

interface FoxRoadmapProps {
  initialRoadmap: Roadmap;
  onClose: () => void;
  isDarkMode: boolean;
}

const FoxRoadmap: React.FC<FoxRoadmapProps> = ({ initialRoadmap, onClose, isDarkMode }) => {
  const [roadmap, setRoadmap] = useState<Roadmap>(initialRoadmap);
  const [activeModule, setActiveModule] = useState<RoadmapModule | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    const count = roadmap.modules.filter(m => m.status === 'COMPLETED').length;
    setCompletedCount(count);
  }, [roadmap]);

  const handleComplete = (id: string) => {
    const updated = updateRoadmapProgress(roadmap, id);
    setRoadmap(updated);
    setActiveModule(null);
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 3000);
  };

  const progressPercent = (completedCount / roadmap.modules.length) * 100;

  return (
    <div className={`fixed inset-0 z-[70] flex flex-col transition-colors duration-500 ${isDarkMode ? 'bg-[#000000] text-white' : 'bg-white text-black'}`}>
      
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-orange-500/5 blur-[150px] rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-orange-500/10 blur-[120px] rounded-full"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 p-8 flex items-center justify-between border-b border-white/10 glass-card backdrop-blur-xl">
        <div className="flex items-center gap-6">
          <button onClick={onClose} className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-orange-500 hover:text-white transition-all">
            <Icons.ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-3xl font-black tracking-tight">The <span className="text-orange-500">Fox Journey</span></h1>
            <p className="text-[10px] font-black uppercase opacity-40 tracking-[0.4em]">Path: {roadmap.roadmap_theme}</p>
          </div>
        </div>

        <div className="flex items-center gap-8">
           <div className="hidden md:block text-right">
             <div className="text-[10px] uppercase font-black opacity-40 mb-1">Progress Efficiency</div>
             <div className="w-48 h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${progressPercent}%` }} className="h-full bg-orange-500" />
             </div>
           </div>
           <div className="flex items-center gap-3 p-2 pr-6 rounded-2xl bg-orange-500/10 border border-orange-500/20">
             <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center text-white shadow-lg">
                <Icons.Sparkles size={20} />
             </div>
             <div className="font-black text-orange-500">{completedCount * 10} Mastery Pts</div>
           </div>
        </div>
      </div>

      <div className="flex-grow flex flex-col lg:flex-row overflow-hidden relative z-10">
        
        {/* Sidebar: Dr. Fox Mentor */}
        <div className="lg:w-96 p-8 border-r border-white/10 overflow-y-auto custom-scrollbar flex flex-col gap-6">
          <div className="p-8 rounded-[3rem] glass-card border-2 border-orange-500/20 bg-orange-500/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-all scale-150"><Icons.Flame size={80} /></div>
            <div className="flex items-center gap-4 mb-6">
               <div className="w-12 h-12 rounded-2xl bg-orange-500 flex items-center justify-center text-white shadow-xl"><Icons.Bot /></div>
               <h3 className="font-black uppercase text-xs tracking-widest">Mentor: Dr. Fox</h3>
            </div>
            <p className="text-sm italic leading-relaxed opacity-80 mb-6">
              "{roadmap.mentor_message}"
            </p>
            <div className="pt-6 border-t border-white/10 flex items-center gap-4">
               <div className="w-10 h-10 rounded-full border-2 border-orange-500 flex items-center justify-center font-black text-orange-500 text-xs">A</div>
               <span className="text-[10px] font-bold uppercase opacity-40">Profile: {initialRoadmap.curation_id}</span>
            </div>
          </div>

          {activeModule ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-8 rounded-[3rem] glass-card border border-white/10 space-y-6">
               <div className="flex items-center justify-between">
                 <span className={`px-3 py-1 rounded-full text-[10px] font-black border ${activeModule.status === 'COMPLETED' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-orange-500/10 text-orange-500 border-orange-500/20'}`}>
                   {activeModule.bloom_level} OBJECTIVE
                 </span>
                 <Icons.Info size={16} className="opacity-20" />
               </div>
               <h2 className="text-2xl font-black">{activeModule.title}</h2>
               <p className="text-sm opacity-60 leading-relaxed">{activeModule.description}</p>
               <div className="space-y-3">
                  <h4 className="text-[10px] font-black uppercase opacity-40">Included Content</h4>
                  <div className="flex flex-wrap gap-2">
                    {activeModule.content_types.map(t => (
                      <span key={t} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[10px] font-bold">{t}</span>
                    ))}
                  </div>
               </div>
               <button 
                 onClick={() => handleComplete(activeModule.id)}
                 className="w-full py-4 bg-orange-500 text-white rounded-2xl font-black shadow-xl hover:bg-orange-600 active:scale-95 transition-all flex items-center justify-center gap-3"
               >
                 <Icons.Zap /> Complete Module
               </button>
            </motion.div>
          ) : (
            <div className="flex-grow flex flex-col items-center justify-center opacity-20 text-center p-10">
               <Icons.Navigation size={48} className="mb-4" />
               <p className="font-bold">Select a lantern <br/>to view details</p>
            </div>
          )}
        </div>

        {/* Path Visualization */}
        <div className="flex-grow p-8 overflow-y-auto custom-scrollbar bg-black/20 flex flex-col items-center relative">
          
          {/* Connecting Line */}
          <div className="absolute top-0 bottom-0 w-1 bg-gradient-to-b from-orange-500/0 via-orange-500/20 to-orange-500/0 left-1/2 -translate-x-1/2" />

          <div className="space-y-12 relative z-10 w-full max-w-2xl py-20">
            {roadmap.modules.map((m, i) => {
              const isEven = i % 2 === 0;
              const isLocked = m.status === 'LOCKED';
              const isCompleted = m.status === 'COMPLETED';
              const isReady = m.status === 'READY';

              return (
                <div key={m.id} className={`flex w-full items-center ${isEven ? 'justify-start' : 'justify-end'} relative`}>
                  
                  {/* Lateral Connector */}
                  <div className={`absolute top-1/2 h-0.5 bg-orange-500/20 w-12 ${isEven ? 'left-1/2' : 'right-1/2'}`} />

                  <motion.button
                    whileHover={!isLocked ? { scale: 1.1, y: -5 } : {}}
                    whileTap={!isLocked ? { scale: 0.95 } : {}}
                    onClick={() => !isLocked && setActiveModule(m)}
                    className={`relative w-24 h-24 rounded-[2rem] flex items-center justify-center border-4 transition-all duration-500 ${
                      isCompleted ? 'bg-orange-500 border-orange-500 shadow-[0_0_30px_rgba(255,126,6,0.6)] text-white' :
                      isReady ? 'bg-black border-orange-500 shadow-[0_0_20px_rgba(255,126,6,0.3)] text-orange-500 animate-pulse' :
                      'bg-white/5 border-white/10 text-white/20 grayscale'
                    }`}
                  >
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap">
                       <span className={`text-[10px] font-black uppercase tracking-widest ${isLocked ? 'opacity-20' : 'opacity-60'}`}>{m.bloom_level} Step</span>
                    </div>
                    
                    {isCompleted ? <Icons.Check size={32} /> : isLocked ? <Icons.Lock size={24} /> : <Icons.Flame size={32} />}
                    
                    <div className={`absolute -bottom-16 left-1/2 -translate-x-1/2 text-center w-48 ${isLocked ? 'opacity-10' : 'opacity-100'}`}>
                       <h4 className="font-black text-sm">{m.title}</h4>
                       <span className="text-[10px] font-bold opacity-40 uppercase">{m.estimated_time_minutes} min</span>
                    </div>
                  </motion.button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Celebration Overlay */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-orange-500/40 backdrop-blur-2xl"
          >
            <motion.div 
              initial={{ scale: 0.5, y: 50 }} animate={{ scale: 1, y: 0 }}
              className="glass-card p-16 rounded-[4rem] border-4 border-white/50 text-center space-y-8 shadow-2xl"
            >
              <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mx-auto shadow-2xl">
                 <Icons.Trophy className="text-orange-500" size={64} />
              </div>
              <div>
                <h1 className="text-5xl font-black text-white mb-2">Neural Link Completed!</h1>
                <p className="text-orange-100 text-xl font-bold">Dr. Fox: "Excellent progress. Your intuition is sharpening."</p>
              </div>
              <div className="flex items-center justify-center gap-3 text-white font-black text-2xl">
                <Icons.Flame /> +10 Mastery Points
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FoxRoadmap;
