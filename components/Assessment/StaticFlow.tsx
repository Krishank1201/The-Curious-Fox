
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ASSESSMENT_QUESTIONS } from '../../constants/assessmentData';
import { calculateStaticScores, getProfileFromScores } from '../../services/assessmentService';
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { AssessmentResult } from '../../types';

interface StaticFlowProps {
  onBack: () => void;
  onComplete: (result: AssessmentResult) => void;
  isDarkMode: boolean;
}

const StaticFlow: React.FC<StaticFlowProps> = ({ onBack, onComplete, isDarkMode }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, 'A' | 'B' | 'C'>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentQ = ASSESSMENT_QUESTIONS[currentIdx];
  const progress = ((currentIdx + 1) / ASSESSMENT_QUESTIONS.length) * 100;

  const handleSelect = (ans: 'A' | 'B' | 'C') => {
    setAnswers(prev => ({ ...prev, [currentQ.id]: ans }));
  };

  const handleNext = () => {
    if (currentIdx < ASSESSMENT_QUESTIONS.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    const scores = calculateStaticScores(answers);
    const result = getProfileFromScores(scores);
    setTimeout(() => onComplete(result), 800);
  };

  return (
    <div className="max-w-3xl mx-auto py-12">
      <button onClick={onBack} className="flex items-center gap-2 text-orange-500 font-bold mb-12 hover:gap-3 transition-all">
        <ArrowLeft size={18} /> Cancel Sprint
      </button>

      <div className="mb-12">
        <div className="flex justify-between items-end mb-4">
          <span className="text-xs font-black uppercase tracking-[0.3em] opacity-40">Synchronizing Brainwaves</span>
          <span className="font-black text-orange-500">{currentIdx + 1} / {ASSESSMENT_QUESTIONS.length}</span>
        </div>
        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/10">
          <motion.div 
            className="h-full bg-orange-500 shadow-[0_0_10px_#FF7E06]" 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIdx}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="glass-card p-12 rounded-[3.5rem] border border-white/10 shadow-2xl"
        >
          <h2 className="text-3xl font-black mb-12 leading-tight">{currentQ.text}</h2>

          <div className="space-y-4">
            {(['A', 'B', 'C'] as const).map(key => (
              <button
                key={key}
                onClick={() => handleSelect(key)}
                className={`w-full p-6 rounded-2xl border-2 text-left text-lg font-bold transition-all flex items-center justify-between group ${
                  answers[currentQ.id] === key
                    ? 'border-orange-500 bg-orange-500/10 text-orange-500 shadow-lg shadow-orange-500/20'
                    : 'border-white/5 bg-white/5 hover:bg-white/10'
                }`}
              >
                <span>{currentQ.options[key]}</span>
                <div className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center transition-all ${
                  answers[currentQ.id] === key ? 'border-orange-500 bg-orange-500 text-white' : 'border-white/10'
                }`}>
                  {answers[currentQ.id] === key && <CheckCircle2 size={16} />}
                </div>
              </button>
            ))}
          </div>

          <div className="mt-12 flex justify-between items-center">
            <button 
              onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
              disabled={currentIdx === 0}
              className="px-8 py-3 rounded-xl font-bold opacity-50 hover:opacity-100 disabled:opacity-0 transition-all"
            >
              Previous
            </button>
            <button
              onClick={handleNext}
              disabled={!answers[currentQ.id] || isSubmitting}
              className={`px-12 py-4 rounded-2xl font-black shadow-xl transition-all flex items-center gap-2 ${
                !answers[currentQ.id] ? 'bg-white/5 opacity-20 cursor-not-allowed' : 'bg-orange-500 text-white hover:bg-orange-600'
              }`}
            >
              {isSubmitting ? 'Analyzing...' : currentIdx === ASSESSMENT_QUESTIONS.length - 1 ? 'Reveal Profile' : 'Next Step'}
              <ArrowRight size={20} />
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default StaticFlow;
