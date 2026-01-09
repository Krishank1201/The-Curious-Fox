
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';
import { drFox } from '../services/drFoxService';
import { LabMode, PracticeType } from '../types';

interface KMeansCodingLabProps {
  onClose: () => void;
  isDarkMode: boolean;
}

const KMeansCodingLab: React.FC<KMeansCodingLabProps> = ({ onClose, isDarkMode }) => {
  const [mode, setMode] = useState<LabMode>('learn');
  const [practiceType, setPracticeType] = useState<PracticeType>('dependent');
  const [stepIndex, setStepIndex] = useState(0);
  const [labData, setLabData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userCode, setUserCode] = useState('');
  const [feedback, setFeedback] = useState<any>(null);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [score, setScore] = useState(0);

  useEffect(() => {
    loadContent();
  }, [mode, stepIndex, practiceType]);

  const loadContent = async () => {
    setIsLoading(true);
    setFeedback(null);
    try {
      if (mode === 'learn') {
        // Fix: Added 'kmeans' as the first argument to getLearnStep
        const data = await drFox.getLearnStep('kmeans', stepIndex);
        if (data) {
          setLabData(data);
          setUserCode(data.code_block?.skeleton_code || '');
        }
      } else if (mode === 'practice') {
        // Fix: Added 'kmeans' as the first argument to getPracticeInitial
        const data = await drFox.getPracticeInitial('kmeans', practiceType, stepIndex);
        if (data) {
          setLabData(data);
          setUserCode(data.code_block?.skeleton_code || '');
          setHintsUsed(0);
        }
      } else if (mode === 'test') {
        setLabData({
          step_title: "Final Assessment",
          dr_fox_message: "Implement a full K-Means pipeline from library imports to centroid inspection. No hints allowed!"
        });
        setUserCode("# Write your full K-Means pipeline here\nimport numpy as np\n");
      }
    } catch (err) {
      console.error("Error loading lab content:", err);
      setLabData({
        step_title: "Error",
        dr_fox_message: "Fox had trouble fetching the instructions. Try again in a moment!"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      if (mode === 'practice') {
        // Fix: Added 'kmeans' as the first argument to submitPractice
        const result = await drFox.submitPractice('kmeans', practiceType, stepIndex, userCode);
        setFeedback(result);
        if (result && result.is_correct) {
          const base = practiceType === 'dependent' ? 12 : 25;
          const penalty = practiceType === 'dependent' ? hintsUsed : (hintsUsed === 1 ? 1 : hintsUsed === 2 ? 3 : hintsUsed === 3 ? 7 : 0);
          setScore(prev => prev + Math.max(0, base - penalty));
        }
      } else if (mode === 'test') {
        // Fix: Removed the unnecessary third argument to match the 2-argument signature in drFoxService.ts
        const result = await drFox.submitTest('kmeans', userCode);
        setFeedback(result);
      }
    } catch (err) {
      console.error("Error submitting code:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-xl flex flex-col p-4 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 transition-all text-orange-500">
            <Icons.X size={24} />
          </button>
          <div>
            <h2 className="text-2xl font-black">Dr. Fox <span className="text-orange-500">Coding Lab</span></h2>
            <div className="text-[10px] uppercase font-black opacity-40 tracking-widest flex items-center gap-2">
              <Icons.ShieldCheck size={10} /> K-Means Master Module
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 p-1 rounded-2xl bg-white/5 border border-white/10">
          {(['learn', 'practice', 'test'] as LabMode[]).map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); setStepIndex(0); setFeedback(null); }}
              className={`px-6 py-2 rounded-xl text-xs font-bold capitalize transition-all ${
                mode === m ? 'bg-orange-500 text-white shadow-lg' : 'hover:bg-white/5 opacity-60'
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
           <div className="text-right">
              <div className="text-[10px] uppercase opacity-40 font-black">Accumulated Score</div>
              <div className="text-xl font-black text-orange-500">{score} pts</div>
           </div>
           <div className="w-12 h-12 rounded-xl bg-orange-500 flex items-center justify-center text-white shadow-lg">
              <Icons.Gamepad2 />
           </div>
        </div>
      </div>

      <div className="flex-grow grid lg:grid-cols-12 gap-6 overflow-hidden">
        {/* Left: Instructions & Dr. Fox */}
        <div className="lg:col-span-4 flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">
          <div className="p-8 rounded-[2.5rem] glass-card border-2 border-orange-500/20 bg-orange-500/5 relative">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center text-white shadow-lg">
                <Icons.BrainCircuit />
              </div>
              <h3 className="text-xl font-black">{labData?.step_title || 'Loading...'}</h3>
            </div>
            
            <p className="text-sm italic opacity-80 leading-relaxed mb-6">
              "{labData?.dr_fox_message || "Give me a second to pull up the module..."}"
            </p>

            {mode === 'learn' && labData?.dataset_preview && (
              <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-3">
                 <div className="text-[10px] font-black uppercase text-orange-500">{labData.dataset_preview.description}</div>
                 <div className="overflow-x-auto">
                   <table className="w-full text-[10px] text-left">
                     <thead>
                       <tr>{labData.dataset_preview.columns?.map((col: string) => <th key={col} className="pb-2 px-2">{col}</th>)}</tr>
                     </thead>
                     <tbody className="opacity-60">
                       {labData.dataset_preview.sample_rows?.map((row: any, i: number) => (
                         <tr key={i} className="border-t border-white/5">
                           {labData.dataset_preview.columns?.map((col: string) => <td key={col} className="py-2 px-2">{row[col]}</td>)}
                         </tr>
                       ))}
                     </tbody>
                   </table>
                 </div>
              </div>
            )}

            {feedback && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="mt-6 p-6 rounded-2xl bg-white/10 border border-white/20">
                <div className={`flex items-center gap-2 font-black mb-3 ${feedback.is_correct ? 'text-green-500' : 'text-orange-500'}`}>
                   {feedback.is_correct ? <Icons.CheckCircle /> : <Icons.AlertCircle />}
                   {feedback.is_correct ? 'Correct!' : 'Keep Refining'}
                </div>
                {feedback.issues?.map((issue: any, i: number) => (
                  <div key={i} className="text-xs opacity-80 mb-2">
                    • {issue.message}
                  </div>
                ))}
              </motion.div>
            )}
          </div>

          <div className="flex-grow">
            {mode === 'learn' && labData?.code_block?.explanation && (
              <div className="space-y-3">
                {labData.code_block.explanation.map((exp: string, i: number) => (
                  <div key={i} className="p-5 rounded-2xl glass-card border border-white/5 text-sm leading-relaxed flex gap-3">
                     <span className="text-orange-500 font-black shrink-0">{i+1}.</span>
                     <span>{exp}</span>
                  </div>
                ))}
              </div>
            )}
            
            {mode === 'practice' && (
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-sm italic opacity-60">
                 {labData?.code_block?.instructions}
              </div>
            )}
          </div>
        </div>

        {/* Right: Code Editor Area */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="flex-grow relative rounded-[2.5rem] overflow-hidden border border-white/10 glass-card bg-[#0D0D0D]">
            <div className="absolute top-0 left-0 right-0 h-10 bg-white/5 border-b border-white/10 flex items-center px-6 gap-2">
               <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
               <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
               <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
               <span className="ml-4 text-[10px] font-black opacity-30 tracking-widest uppercase">fox_den_ide_v3.py</span>
            </div>
            
            <textarea
              value={userCode}
              onChange={(e) => setUserCode(e.target.value)}
              disabled={mode === 'learn' || isLoading}
              className="w-full h-full pt-16 pb-8 px-8 bg-transparent outline-none font-mono text-sm leading-relaxed resize-none text-orange-100 selection:bg-orange-500/30"
              spellCheck={false}
            />

            {isLoading && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                 <div className="flex flex-col items-center gap-4">
                   <div className="w-12 h-12 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin"></div>
                   <div className="text-orange-500 font-black animate-pulse uppercase tracking-widest text-xs">AI Reasoning...</div>
                 </div>
              </div>
            )}
          </div>

          {/* Footer Controls */}
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-3xl border border-white/10">
            <div className="flex gap-2">
              {mode === 'learn' && (
                <>
                  <button onClick={() => setStepIndex(prev => Math.max(0, prev - 1))} className="px-6 py-3 rounded-2xl bg-white/5 hover:bg-white/10 font-bold transition-all flex items-center gap-2">
                    <Icons.ChevronLeft size={18} /> Prev Step
                  </button>
                  <button onClick={() => setStepIndex(prev => prev + 1)} className="px-10 py-3 rounded-2xl bg-orange-500 text-white font-black shadow-lg hover:bg-orange-600 transition-all flex items-center gap-2">
                    Next Step <Icons.ChevronRight size={18} />
                  </button>
                </>
              )}

              {(mode === 'practice' || mode === 'test') && (
                <>
                  <button 
                    onClick={handleSubmit} 
                    disabled={isLoading}
                    className="px-12 py-3 rounded-2xl bg-orange-500 text-white font-black shadow-lg hover:bg-orange-600 transition-all flex items-center gap-2"
                  >
                    <Icons.Terminal size={18} /> {mode === 'practice' ? 'Validate Step' : 'Submit Final Code'}
                  </button>
                  
                  {mode === 'practice' && feedback?.issues && (
                    <button 
                      onClick={() => {
                        setHintsUsed(prev => Math.min(3, prev + 1));
                        alert(feedback.issues[0]?.hint || "Try checking your syntax!");
                      }} 
                      className="px-8 py-3 rounded-2xl bg-white/10 hover:bg-white/20 font-bold transition-all flex items-center gap-2 border border-white/10"
                    >
                      <Icons.Lightbulb className="text-yellow-400" size={18} /> Need a Hint?
                    </button>
                  )}
                </>
              )}
            </div>

            {mode === 'practice' && (
              <div className="flex items-center gap-4 px-6 border-l border-white/10">
                <div className="flex flex-col items-end">
                   <span className="text-[10px] uppercase font-black opacity-40">Practice Type</span>
                   <select 
                    value={practiceType} 
                    onChange={(e) => setPracticeType(e.target.value as PracticeType)}
                    className="bg-transparent font-bold text-orange-500 outline-none"
                   >
                     <option value="dependent">Dependent (Scaffolded)</option>
                     <option value="independent">Independent (Advanced)</option>
                   </select>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KMeansCodingLab;
