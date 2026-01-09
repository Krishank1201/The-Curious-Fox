
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, MessageSquare, ArrowLeft, GraduationCap, Sparkles } from 'lucide-react';
import StaticFlow from './StaticFlow';
import AIFlow from './AIFlow';
import Results from './Results';
import { AssessmentResult } from '../../types';

interface AssessmentFlowProps {
  onComplete: (result: AssessmentResult) => void;
  isDarkMode: boolean;
}

const AssessmentFlow: React.FC<AssessmentFlowProps> = ({ onComplete, isDarkMode }) => {
  const [path, setPath] = useState<'selector' | 'static' | 'ai' | 'results'>('selector');
  const [result, setResult] = useState<AssessmentResult | null>(null);

  const handleComplete = (res: AssessmentResult) => {
    setResult(res);
    setPath('results');
    onComplete(res);
  };

  return (
    <div className="max-w-6xl mx-auto min-h-[calc(100vh-12rem)]">
      <AnimatePresence mode="wait">
        {path === 'selector' && (
          <motion.div
            key="selector"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="py-12 px-6"
          >
            <div className="text-center mb-16">
              <h1 className="text-5xl md:text-6xl font-black mb-6">Discovery Path</h1>
              <p className="text-xl opacity-60 max-w-2xl mx-auto">
                How should we decode your learning style today? Choose your quest.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Static Path */}
              <button
                onClick={() => setPath('static')}
                className="group p-10 rounded-[3rem] glass-card border-2 border-transparent hover:border-orange-500 transition-all text-left relative overflow-hidden"
              >
                <div className="absolute -right-8 -top-8 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl group-hover:bg-orange-500/20 transition-all"></div>
                <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center text-white mb-8 shadow-xl shadow-orange-500/20 group-hover:scale-110 transition-transform">
                  <Zap size={32} />
                </div>
                <h3 className="text-3xl font-black mb-4">The Sprint</h3>
                <p className="opacity-60 font-medium mb-8">
                  12 precise questions for a fast, deterministic mapping of your brain's defaults.
                </p>
                <div className="flex items-center gap-2 text-orange-500 font-bold">
                  Start Quick Assessment <Sparkles size={16} />
                </div>
              </button>

              {/* AI Path */}
              <button
                onClick={() => setPath('ai')}
                className="group p-10 rounded-[3rem] glass-card border-2 border-transparent hover:border-orange-500 transition-all text-left relative overflow-hidden"
              >
                <div className="absolute -right-8 -top-8 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl group-hover:bg-orange-500/20 transition-all"></div>
                <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center text-white mb-8 shadow-xl shadow-orange-500/20 group-hover:scale-110 transition-transform">
                  <MessageSquare size={32} />
                </div>
                <h3 className="text-3xl font-black mb-4">Chat Dr. Fox</h3>
                <p className="opacity-60 font-medium mb-8">
                  A deep-dive conversation that extracts subtle nuances and provides contextual insights.
                </p>
                <div className="flex items-center gap-2 text-orange-500 font-bold">
                  Begin Interview <GraduationCap size={16} />
                </div>
              </button>
            </div>
          </motion.div>
        )}

        {path === 'static' && (
          <StaticFlow 
            key="static"
            onBack={() => setPath('selector')} 
            onComplete={handleComplete} 
            isDarkMode={isDarkMode} 
          />
        )}

        {path === 'ai' && (
          <AIFlow 
            key="ai"
            onBack={() => setPath('selector')} 
            onComplete={handleComplete} 
            isDarkMode={isDarkMode} 
          />
        )}

        {path === 'results' && result && (
          <Results 
            key="results"
            result={result} 
            isDarkMode={isDarkMode} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AssessmentFlow;
