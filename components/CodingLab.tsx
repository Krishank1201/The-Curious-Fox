
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';
import { drFox } from '../services/drFoxService';
import { LabMode, PracticeType } from '../types';

interface CodingLabProps {
  algorithm: 'kmeans' | 'apriori' | 'pca';
  onClose: () => void;
  isDarkMode: boolean;
}

const CodingLab: React.FC<CodingLabProps> = ({ algorithm, onClose, isDarkMode }) => {
  const [mode, setMode] = useState<LabMode>('learn');
  const [practiceType, setPracticeType] = useState<PracticeType>('dependent');
  const [stepIndex, setStepIndex] = useState(0);
  const [labData, setLabData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userCode, setUserCode] = useState('');
  const [feedback, setFeedback] = useState<any>(null);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [score, setScore] = useState(0);
  const [activeHint, setActiveHint] = useState<string | null>(null);
  const [showXPFeedback, setShowXPFeedback] = useState<number | null>(null);

  const objectives = {
    learn: { title: 'Safe Discovery', icon: Icons.Shield, desc: 'Dr. Fox explains the logic block-by-block. Earn +3 XP per step!' },
    practice: { title: 'Guided Practice', icon: Icons.Hammer, desc: 'Dependent (+12 XP) uses blanks. Independent (+25 XP) is from scratch. Hint penalties apply!' },
    test: { title: 'Exam Readiness', icon: Icons.Trophy, desc: 'No safety nets. Build the full pipeline to earn your certification points.' }
  };

  useEffect(() => {
    loadContent();
  }, [mode, stepIndex, practiceType]);

  const loadContent = async () => {
    setIsLoading(true);
    setFeedback(null);
    setHintsUsed(0);
    setActiveHint(null);
    try {
      let data;
      if (mode === 'learn') {
        data = await drFox.getLearnStep(algorithm, stepIndex);
      } else if (mode === 'practice') {
        data = await drFox.getPracticeInitial(algorithm, practiceType, stepIndex);
      } else if (mode === 'test') {
        data = {
          step_title: `${algorithm.toUpperCase()} Certification`,
          dr_fox_message: "Implement the complete pipeline. I'll check your preprocessing, parameters, and results."
        };
        setUserCode(`# Complete ${algorithm.toUpperCase()} Implementation\nimport pandas as pd\nimport numpy as np\n`);
      }

      if (data) {
        setLabData(data);
        if (mode !== 'test') setUserCode(data.code_block?.skeleton_code || '');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextLearnStep = () => {
    setStepIndex(prev => prev + 1);
    const xp = 3;
    setScore(s => s + xp);
    triggerXPFeedback(xp);
  };

  const triggerXPFeedback = (amount: number) => {
    setShowXPFeedback(amount);
    setTimeout(() => setShowXPFeedback(null), 1500);
  };

  const showHint = () => {
    // Deducting points context:
    // Dependent: -2 per hint
    // Independent: -1, -2, -4, -8...
    const penaltyNext = practiceType === 'dependent' ? 2 : Math.pow(2, hintsUsed);
    
    if (confirm(`Dr. Fox: "Careful now! A hint will cost you ${penaltyNext} XP potential from this step. Shall we proceed?"`)) {
      setHintsUsed(h => h + 1);
      
      let hintText = "Check your logic!";
      if (feedback?.issues?.[0]) {
        hintText = hintsUsed === 0 ? feedback.issues[0].hint : feedback.issues[0].deeper_hint;
      } else {
        hintText = "I suggest looking at the standard library documentation for " + algorithm + " if you're stuck on syntax.";
      }
      
      setActiveHint(hintText);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      if (mode === 'practice') {
        const result = await drFox.submitPractice(algorithm, practiceType, stepIndex, userCode);
        setFeedback(result);
        if (result?.is_correct) {
          let earned = 0;
          if (practiceType === 'dependent') {
            // +12 Base, -2 per hint
            earned = Math.max(0, 12 - (hintsUsed * 2));
          } else {
            // +25 Base, exponential: Sum of penalties (1, 2, 4...) is 2^n - 1
            const totalPenalty = Math.pow(2, hintsUsed) - 1;
            earned = Math.max(0, 25 - totalPenalty);
          }
          setScore(s => s + earned);
          triggerXPFeedback(earned);
        }
      } else if (mode === 'test') {
        const result = await drFox.submitTest(algorithm, userCode);
        setFeedback(result);
        if (result?.is_fully_correct) {
          setScore(s => s + 50);
          triggerXPFeedback(50);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Theme Constants
  const themeBg = isDarkMode ? 'bg-black' : 'bg-white';
  const themeText = isDarkMode ? 'text-white' : 'text-black';
  const cardBg = isDarkMode ? 'bg-white/5' : 'bg-white shadow-xl border-orange-100';
  const cardBorder = isDarkMode ? 'border-white/10' : 'border-orange-200';

  return (
    <div className={`fixed inset-0 z-[60] flex flex-col p-4 md:p-8 overflow-hidden transition-colors duration-500 ${themeBg} ${themeText}`}>
      
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-500/10 blur-[150px] rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-orange-500/5 blur-[120px] rounded-full"></div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-8 relative z-10">
        <div className="flex items-center gap-4">
          <button 
            onClick={onClose} 
            className={`p-3 rounded-2xl transition-all border ${isDarkMode ? 'bg-white/5 border-white/10 text-orange-500 hover:bg-white/10' : 'bg-orange-50 border-orange-200 text-orange-600 hover:bg-orange-100'}`}
          >
            <Icons.X size={20} />
          </button>
          <div>
            <h2 className="text-2xl font-black italic tracking-tight">DR. FOX <span className="text-orange-500 NOT-italic">DEN</span></h2>
            <p className="text-[10px] uppercase font-black opacity-30 tracking-[0.4em]">{algorithm} Laboratory</p>
          </div>
        </div>

        <div className={`flex items-center gap-1 p-1 rounded-2xl border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-orange-50 border-orange-200'}`}>
          {(['learn', 'practice', 'test'] as LabMode[]).map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); setStepIndex(0); setFeedback(null); }}
              className={`px-8 py-2.5 rounded-xl text-xs font-black uppercase transition-all ${
                mode === m ? 'bg-orange-500 text-white shadow-lg' : 'hover:bg-orange-500/10 opacity-40'
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4 relative">
          <AnimatePresence>
            {showXPFeedback !== null && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: -40 }} exit={{ opacity: 0 }}
                className="absolute top-0 right-0 font-black text-orange-500 text-3xl"
              >
                +{showXPFeedback} XP
              </motion.div>
            )}
          </AnimatePresence>
          <div className="text-right">
             <div className="text-[10px] uppercase font-black opacity-40 tracking-widest">Global Mastery</div>
             <div className="text-2xl font-black text-orange-500">{score} XP</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-orange-500 flex items-center justify-center text-white shadow-xl shadow-orange-500/20">
             <Icons.Flame />
          </div>
        </div>
      </div>

      <div className="flex-grow grid lg:grid-cols-12 gap-8 overflow-hidden relative z-10">
        {/* Sidebar: Mentor Instructions */}
        <div className="lg:col-span-4 flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">
          
          <div className={`p-6 rounded-[2rem] border-2 ${isDarkMode ? 'bg-orange-500/5 border-orange-500/20' : 'bg-orange-50 border-orange-500/30'}`}>
             <div className="flex items-center gap-3 mb-2 text-orange-500">
               {React.createElement(objectives[mode].icon, { size: 20 })}
               <h4 className="font-black uppercase text-xs tracking-widest">{objectives[mode].title}</h4>
             </div>
             <p className={`text-xs font-semibold leading-relaxed ${isDarkMode ? 'opacity-70' : 'text-slate-700'}`}>{objectives[mode].desc}</p>
          </div>

          <div className={`p-8 rounded-[2.5rem] border flex flex-col flex-grow ${cardBg} ${cardBorder}`}>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center text-white">
                <Icons.Bot size={20} />
              </div>
              <h3 className="text-lg font-black">{labData?.step_title || 'Compiling logic...'}</h3>
            </div>
            
            <p className={`text-sm italic leading-relaxed mb-6 font-medium ${isDarkMode ? 'opacity-80' : 'text-slate-600'}`}>
              "{labData?.dr_fox_message || "Aligning the neural nodes for your coding session..."}"
            </p>

            <AnimatePresence>
              {activeHint && (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="p-4 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-600 mb-6 text-xs font-bold leading-relaxed relative">
                   <button onClick={() => setActiveHint(null)} className="absolute top-2 right-2"><Icons.X size={12} /></button>
                   <div className="flex items-center gap-2 uppercase tracking-widest text-[9px] mb-1"><Icons.Lightbulb size={10} /> Mentor Hint</div>
                   {activeHint}
                </motion.div>
              )}
            </AnimatePresence>

            {mode === 'learn' && labData?.dataset_preview && (
              <div className={`p-4 rounded-2xl border mb-6 ${isDarkMode ? 'bg-black/40 border-white/5' : 'bg-orange-50 border-orange-100'}`}>
                 <div className="text-[9px] font-black uppercase text-orange-500 mb-2">{labData.dataset_preview.description}</div>
                 <div className="overflow-x-auto">
                   <table className={`w-full text-[9px] text-left border-collapse ${isDarkMode ? '' : 'text-slate-800'}`}>
                     <thead className="opacity-40">
                       <tr>{labData.dataset_preview.columns?.map((col: string) => <th key={col} className="pb-1 px-1">{col}</th>)}</tr>
                     </thead>
                     <tbody className="opacity-70">
                       {labData.dataset_preview.sample_rows?.map((row: any, i: number) => (
                         <tr key={i} className={`border-t ${isDarkMode ? 'border-white/5' : 'border-orange-200'}`}>
                           {labData.dataset_preview.columns?.map((col: string) => <td key={col} className="py-1 px-1">{row[col]}</td>)}
                         </tr>
                       ))}
                     </tbody>
                   </table>
                 </div>
              </div>
            )}

            {feedback && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`p-5 rounded-2xl border-l-4 ${feedback.is_correct ? 'bg-green-500/10 border-green-500' : 'bg-red-500/10 border-red-500'} mb-6`}>
                <div className={`font-black text-xs uppercase mb-2 flex items-center gap-2 ${feedback.is_correct ? 'text-green-600' : 'text-red-600'}`}>
                   {feedback.is_correct ? <Icons.CheckCircle size={14}/> : <Icons.AlertCircle size={14}/>}
                   {feedback.is_correct ? 'Logic Validated' : 'Logic Mismatch'}
                </div>
                {feedback.issues?.map((issue: any, i: number) => (
                  <p key={i} className="text-xs opacity-70 leading-relaxed mb-1">• {issue.message}</p>
                ))}
              </motion.div>
            )}

            {mode === 'learn' && labData?.code_block?.explanation && (
              <div className="space-y-2 mt-4 flex-grow overflow-y-auto custom-scrollbar pr-2">
                {labData.code_block.explanation.map((exp: string, i: number) => (
                  <div key={i} className={`p-3 rounded-xl border text-[11px] leading-relaxed flex gap-2 ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-orange-50 border-orange-100'}`}>
                     <span className="text-orange-500 font-black">{i+1}</span>
                     <span className={isDarkMode ? 'opacity-80' : 'text-slate-800'}>{exp}</span>
                  </div>
                ))}
              </div>
            )}
            
            {mode === 'practice' && labData?.code_block?.instructions && (
               <div className={`p-4 rounded-xl border italic text-xs leading-relaxed ${isDarkMode ? 'bg-white/5 border-white/10 opacity-60' : 'bg-slate-50 border-orange-100 text-slate-600'}`}>
                  {labData.code_block.instructions}
               </div>
            )}
          </div>
        </div>

        {/* Editor Area */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className={`flex-grow relative rounded-[2.5rem] overflow-hidden border shadow-2xl ${isDarkMode ? 'bg-[#0A0A0A] border-white/10' : 'bg-white border-orange-200'}`}>
            <div className={`absolute top-0 left-0 right-0 h-12 border-b flex items-center px-6 justify-between z-10 ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-orange-50 border-orange-200'}`}>
               <div className="flex gap-2">
                 <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                 <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                 <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
               </div>
               <span className="text-[8px] font-black opacity-30 tracking-[0.4em] uppercase">
                 {algorithm}_{mode}_kernel_v4.py {mode === 'learn' && '[READ ONLY]'}
               </span>
            </div>
            
            <textarea
              value={userCode}
              onChange={(e) => setUserCode(e.target.value)}
              readOnly={mode === 'learn'}
              disabled={isLoading}
              className={`w-full h-full pt-16 pb-8 px-10 bg-transparent outline-none font-mono text-sm leading-relaxed resize-none selection:bg-orange-500/40 custom-scrollbar ${mode === 'learn' ? 'cursor-default' : ''} ${isDarkMode ? 'text-orange-50/80' : 'text-slate-800'}`}
              spellCheck={false}
            />

            {isLoading && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-20">
                 <div className="flex flex-col items-center gap-4">
                   <div className="w-12 h-12 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin"></div>
                   <div className="text-orange-500 font-black animate-pulse uppercase tracking-[0.4em] text-[10px]">Evaluating logic...</div>
                 </div>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className={`flex flex-col md:flex-row items-center justify-between p-4 rounded-3xl border gap-4 ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-orange-200 shadow-lg'}`}>
            <div className="flex gap-3 w-full md:w-auto">
              {mode === 'learn' && (
                <>
                  <button onClick={() => setStepIndex(prev => Math.max(0, prev - 1))} disabled={stepIndex === 0} className={`px-8 py-3.5 rounded-2xl font-bold border transition-all flex items-center gap-2 disabled:opacity-20 ${isDarkMode ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-white border-orange-200 hover:bg-orange-50'}`}>
                    <Icons.ArrowLeft size={16} /> Prev Step
                  </button>
                  <button onClick={handleNextLearnStep} className="px-12 py-3.5 rounded-2xl bg-orange-500 text-white font-black shadow-xl hover:bg-orange-600 transition-all flex items-center gap-2 active:scale-95">
                    Next Step (+3 XP) <Icons.ArrowRight size={16} />
                  </button>
                </>
              )}

              {mode === 'practice' && (
                <>
                  <button 
                    onClick={handleSubmit} 
                    disabled={isLoading}
                    className="flex-grow px-12 py-3.5 rounded-2xl bg-orange-500 text-white font-black shadow-xl hover:bg-orange-600 transition-all flex items-center justify-center gap-3"
                  >
                    <Icons.Terminal size={18} /> Run Validation
                  </button>
                  <button 
                    onClick={showHint} 
                    className={`px-8 py-3.5 rounded-2xl font-bold border transition-all flex items-center gap-2 ${isDarkMode ? 'bg-white/10 border-white/10 hover:bg-white/20' : 'bg-white border-orange-200 hover:bg-orange-100'}`}
                  >
                    <Icons.Lightbulb className="text-yellow-400" size={16} /> Hint ({hintsUsed})
                  </button>
                </>
              )}

              {mode === 'test' && (
                <button 
                  onClick={handleSubmit} 
                  disabled={isLoading}
                  className="px-16 py-3.5 rounded-2xl bg-orange-500 text-white font-black shadow-xl hover:bg-orange-600 transition-all flex items-center gap-3"
                >
                  <Icons.ShieldCheck size={20} /> Final Review
                </button>
              )}
            </div>

            {mode === 'practice' && (
              <div className={`flex items-center gap-6 px-6 border-l w-full md:w-auto justify-between ${isDarkMode ? 'border-white/10' : 'border-orange-200'}`}>
                <div className="flex flex-col items-end">
                   <span className="text-[9px] uppercase font-black opacity-30 tracking-widest mb-1">Challenge</span>
                   <select 
                    value={practiceType} 
                    onChange={(e) => setPracticeType(e.target.value as PracticeType)}
                    className="bg-transparent font-black text-orange-500 outline-none text-[11px] cursor-pointer"
                   >
                     <option value="dependent">Dependent (Blanks)</option>
                     <option value="independent">Independent (Empty)</option>
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

export default CodingLab;
