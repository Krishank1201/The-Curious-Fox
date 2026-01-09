
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';
import { AdaptiveQuiz, AdaptiveQuizQuestion, AssessmentResult, BloomLevel } from '../../types';
import { getDrFoxFeedback } from '../../services/quizEngine';

interface AdaptiveQuizViewProps {
  quiz: AdaptiveQuiz;
  onComplete: (score: number, total: number) => void;
  onClose: () => void;
  isDarkMode: boolean;
}

const AdaptiveQuizView: React.FC<AdaptiveQuizViewProps> = ({ quiz, onComplete, onClose, isDarkMode }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const currentQ = quiz.questions[currentIdx];
  const isCorrect = selectedOpt === currentQ?.correct_answer;

  const handleSelect = (opt: string) => {
    if (showFeedback) return;
    setSelectedOpt(opt);
    setShowFeedback(true);
    if (opt === currentQ.correct_answer) setScore(s => s + 1);
  };

  const nextQuestion = () => {
    if (currentIdx < quiz.questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setSelectedOpt(null);
      setShowFeedback(false);
    } else {
      setIsFinished(true);
    }
  };

  if (isFinished) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center p-10 text-center space-y-8 max-w-2xl mx-auto">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1, rotate: 360 }} className="w-32 h-32 bg-orange-500 rounded-full flex items-center justify-center text-white shadow-2xl">
           <Icons.Trophy size={64} />
        </motion.div>
        <div>
          <h2 className="text-5xl font-black mb-2">Quiz Completed!</h2>
          <p className="text-xl opacity-60">You mastered {score} out of {quiz.questions.length} concepts.</p>
        </div>
        <div className="p-8 rounded-[3rem] glass-card border border-orange-500/30 bg-orange-500/5 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-5"><Icons.Bot size={80} /></div>
           <p className="text-lg italic font-medium">"{getDrFoxFeedback(score, quiz.questions.length)}"</p>
        </div>
        <div className="flex gap-4 w-full">
           <button onClick={() => onComplete(score, quiz.questions.length)} className="flex-1 py-4 bg-orange-500 text-white rounded-2xl font-black shadow-xl hover:bg-orange-600 transition-all active:scale-95">Accept Mastery Pts</button>
           <button onClick={onClose} className="flex-1 py-4 bg-white/5 border border-white/10 rounded-2xl font-black hover:bg-white/10 transition-all">Back to Dashboard</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-grow flex flex-col max-w-4xl mx-auto w-full p-6 md:p-10">
      {/* Progress Header */}
      <div className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-4">
           <button onClick={onClose} className="p-3 rounded-xl bg-white/5 border border-white/10 text-orange-500 hover:bg-orange-500 hover:text-white transition-all">
             <Icons.ArrowLeft size={20} />
           </button>
           <div>
             <h3 className="font-black text-xl">{quiz.topic} Mastery</h3>
             <p className="text-[10px] font-black uppercase opacity-40 tracking-widest">Adaptive Challenge: {quiz.target_bloom} Stage</p>
           </div>
        </div>
        <div className="flex items-center gap-6">
           <div className="text-right">
              <div className="text-[10px] font-black uppercase opacity-40">Progress</div>
              <div className="font-black text-xl text-orange-500">{currentIdx + 1} / {quiz.questions.length}</div>
           </div>
           <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500">
              <Icons.Target size={24} />
           </div>
        </div>
      </div>

      {/* Intro Message */}
      {currentIdx === 0 && !showFeedback && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-10 p-6 rounded-3xl bg-orange-500/5 border border-orange-500/10 flex gap-4 items-center">
           <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center text-white shrink-0"><Icons.Bot size={24}/></div>
           <p className="text-sm italic font-medium opacity-80">"{quiz.dr_fox_intro}"</p>
        </motion.div>
      )}

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={currentIdx}
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
          className="flex-grow flex flex-col gap-8"
        >
          <div className="space-y-6">
             <span className="px-3 py-1 rounded-full bg-orange-500/10 text-orange-500 text-[10px] font-black uppercase border border-orange-500/20">{currentQ.bloom_level} Cognitive Depth</span>
             <h2 className="text-3xl font-black leading-tight">{currentQ.question_text}</h2>
          </div>

          <div className="grid gap-4">
            {currentQ.options.map((opt, i) => {
              const isSelected = selectedOpt === opt;
              const isCorrectOpt = opt === currentQ.correct_answer;
              
              let styles = "w-full p-6 rounded-[2rem] border-2 text-left text-lg font-bold transition-all flex items-center justify-between group ";
              if (!showFeedback) {
                styles += "bg-white/5 border-white/5 hover:border-orange-500/50 hover:bg-orange-500/5";
              } else if (isCorrectOpt) {
                styles += "bg-emerald-500/10 border-emerald-500 text-emerald-500";
              } else if (isSelected && !isCorrectOpt) {
                styles += "bg-red-500/10 border-red-500 text-red-500";
              } else {
                styles += "bg-white/5 border-white/5 opacity-30 grayscale";
              }

              return (
                <button 
                  key={i} 
                  onClick={() => handleSelect(opt)}
                  className={styles}
                  disabled={showFeedback}
                >
                  <div className="flex items-center gap-4">
                     <span className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-xs font-black group-hover:bg-orange-500 group-hover:text-white transition-colors">{String.fromCharCode(65+i)}</span>
                     <span>{opt}</span>
                  </div>
                  {showFeedback && isCorrectOpt && <Icons.CheckCircle2 />}
                  {showFeedback && isSelected && !isCorrectOpt && <Icons.XCircle />}
                </button>
              );
            })}
          </div>

          {showFeedback && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-8 rounded-[3rem] glass-card border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 bg-black/20 mt-auto">
               <div className="space-y-2">
                 <div className="flex items-center gap-2 font-black text-xs uppercase tracking-widest text-orange-500"><Icons.Lightbulb size={14}/> Dr. Fox Insight</div>
                 <p className="text-sm opacity-80 leading-relaxed font-medium">"{currentQ.explanation}"</p>
               </div>
               <button 
                 onClick={nextQuestion}
                 className="px-12 py-4 bg-orange-500 text-white rounded-2xl font-black shadow-xl hover:bg-orange-600 transition-all flex items-center gap-2 whitespace-nowrap active:scale-95"
               >
                 {currentIdx === quiz.questions.length - 1 ? 'Final Review' : 'Next Discovery'} <Icons.ChevronRight size={20} />
               </button>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default AdaptiveQuizView;
