
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AIML_MODULE_4_TOPICS } from '../constants';
import * as Icons from 'lucide-react';

interface QuizPlatformProps {
  isDarkMode: boolean;
}

const QuizPlatform: React.FC<QuizPlatformProps> = ({ isDarkMode }) => {
  const navigate = useNavigate();
  // We'll flatten all available questions for the generic platform
  const allQuestions = AIML_MODULE_4_TOPICS.flatMap(t => t.quiz);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);
    if (index === allQuestions[currentIndex].correctAnswer) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    if (currentIndex < allQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
    } else {
      setIsFinished(true);
    }
  };

  if (isFinished) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center space-y-8">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-48 h-48 mx-auto bg-orange-500 rounded-full flex items-center justify-center text-white shadow-2xl"
        >
          <Icons.Trophy size={80} />
        </motion.div>
        <h1 className="text-5xl font-black">Great Job!</h1>
        <p className="text-2xl opacity-70">You scored {score} out of {allQuestions.length}</p>
        <div className="flex gap-4 justify-center">
          <button 
            onClick={() => {
              setCurrentIndex(0);
              setScore(0);
              setIsFinished(false);
              setSelectedAnswer(null);
            }}
            className="px-8 py-4 bg-orange-500 text-white rounded-2xl font-bold shadow-xl hover:bg-orange-600 transition-all"
          >
            Try Again
          </button>
          <button 
            onClick={() => navigate('/')}
            className="px-8 py-4 bg-white/10 rounded-2xl font-bold hover:bg-white/20 transition-all"
          >
            Back Home
          </button>
        </div>
      </div>
    );
  }

  const question = allQuestions[currentIndex];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-12 flex items-center justify-between">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm font-bold text-orange-500 hover:gap-3 transition-all"
        >
          <Icons.ArrowLeft size={18} /> Exit Arena
        </button>
        <div className="flex items-center gap-6">
           <div className="text-right">
             <div className="text-[10px] uppercase font-black opacity-40">Progress</div>
             <div className="font-black text-xl">{currentIndex + 1} / {allQuestions.length}</div>
           </div>
           <div className="w-16 h-16 rounded-2xl glass-card flex items-center justify-center text-orange-500">
             <Icons.Timer />
           </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="p-12 rounded-[3rem] glass-card shadow-2xl border border-white/10"
        >
          <h2 className="text-3xl font-black mb-10 leading-tight">
            {question.question}
          </h2>

          <div className="grid gap-4">
            {question.options.map((option, idx) => {
              const isSelected = selectedAnswer === idx;
              const isCorrect = idx === question.correctAnswer;
              let btnClass = "w-full p-6 rounded-2xl border-2 text-left text-lg font-bold transition-all flex items-center justify-between ";
              
              if (selectedAnswer === null) {
                btnClass += "bg-white/5 border-white/10 hover:border-orange-500 hover:bg-orange-500/5";
              } else if (isCorrect) {
                btnClass += "bg-green-500/20 border-green-500 text-green-500";
              } else if (isSelected && !isCorrect) {
                btnClass += "bg-red-500/20 border-red-500 text-red-500";
              } else {
                btnClass += "bg-white/5 border-white/5 opacity-50";
              }

              return (
                <button 
                  key={idx} 
                  disabled={selectedAnswer !== null}
                  onClick={() => handleAnswer(idx)}
                  className={btnClass}
                >
                  <span>{option}</span>
                  {selectedAnswer !== null && isCorrect && <Icons.CheckCircle />}
                  {selectedAnswer !== null && isSelected && !isCorrect && <Icons.XCircle />}
                </button>
              );
            })}
          </div>

          <div className="mt-10 flex items-center justify-between pt-10 border-t border-white/10">
             {selectedAnswer !== null ? (
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-grow">
                  <p className="text-sm opacity-60 max-w-md italic">
                    "{question.solution}"
                  </p>
               </motion.div>
             ) : (
               <div className="text-sm opacity-40">Select an answer to reveal the explanation.</div>
             )}

             <button 
               onClick={nextQuestion}
               disabled={selectedAnswer === null}
               className={`px-10 py-4 rounded-2xl font-black transition-all flex items-center gap-2 ${
                 selectedAnswer === null ? 'bg-white/5 opacity-20 cursor-not-allowed' : 'bg-orange-500 text-white shadow-xl shadow-orange-500/20'
               }`}
             >
               {currentIndex === allQuestions.length - 1 ? 'Finish' : 'Next Question'}
               <Icons.ChevronRight />
             </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default QuizPlatform;
