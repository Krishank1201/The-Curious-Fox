
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { SUBJECTS, MASCOT_IMAGE } from '../constants';
import * as Icons from 'lucide-react';

interface HomeProps {
  isDarkMode: boolean;
}

const Home: React.FC<HomeProps> = ({ isDarkMode }) => {
  const navigate = useNavigate();
  const savedUser = localStorage.getItem('curious_fox_user');
  const user = savedUser ? JSON.parse(savedUser) : null;
  const hasAssessment = !!user?.assessmentResult;

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-12">
      {/* Hero Header */}
      <section className="relative h-72 md:h-96 rounded-[3rem] overflow-hidden group shadow-2xl">
        <motion.img 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 15, repeat: Infinity, repeatType: 'reverse' }}
          src={MASCOT_IMAGE}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-orange-600/90 via-orange-600/50 to-transparent flex items-center px-8 md:px-16">
          <div className="max-w-2xl">
            <motion.div
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
            >
              <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-none tracking-tighter">
                Curious Fox <br/> <span className="text-orange-200">Academy</span>
              </h1>
              
              {!hasAssessment ? (
                <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20 mb-8 max-w-md">
                   <p className="text-orange-50 font-bold mb-4">You haven't completed your learning assessment yet. Unlock your potential now!</p>
                   <button 
                    onClick={() => navigate('/assessment')}
                    className="w-full px-8 py-4 bg-orange-500 text-white rounded-2xl font-black shadow-xl hover:bg-orange-600 transition-all flex items-center justify-center gap-3 active:scale-95"
                  >
                    <Icons.Zap /> Start Your Assessment
                  </button>
                </div>
              ) : (
                <div className="flex flex-col md:flex-row gap-4 mb-8">
                  <button 
                    onClick={() => navigate('/assessment')}
                    className="px-10 py-4 bg-white text-orange-600 rounded-2xl font-black shadow-2xl hover:bg-orange-100 transition-all flex items-center gap-2"
                  >
                    <Icons.BrainCircuit /> View Learning Profile
                  </button>
                  <button 
                    onClick={() => navigate('/quiz')}
                    className="px-10 py-4 bg-orange-500/80 backdrop-blur-md text-white border border-white/20 rounded-2xl font-black shadow-2xl hover:bg-orange-500 transition-all flex items-center gap-2"
                  >
                    <Icons.PlayCircle /> Jump Into Quiz
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Profile Summary if exists */}
      {hasAssessment && (
        <section className="grid md:grid-cols-4 gap-6">
          <div className="md:col-span-3 glass-card p-8 rounded-[2.5rem] flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
             <div className="absolute -top-12 -right-12 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl"></div>
             <div className="w-24 h-24 rounded-3xl bg-orange-500 flex items-center justify-center text-white shrink-0 shadow-xl shadow-orange-500/20">
                <span className="text-3xl font-black">{user.assessmentResult.profileCode}</span>
             </div>
             <div>
                <h2 className="text-2xl font-black mb-1">Your Profile: <span className="text-orange-500">{user.assessmentResult.profileLabel}</span></h2>
                <p className="opacity-60 text-sm font-medium leading-relaxed">{user.assessmentResult.profileDescription}</p>
             </div>
             <button 
               onClick={() => navigate('/assessment')}
               className="ml-auto p-4 rounded-2xl bg-white/5 border border-white/10 text-orange-500 hover:bg-orange-500 hover:text-white transition-all"
             >
                <Icons.Settings size={20} />
             </button>
          </div>
          <div className="glass-card p-8 rounded-[2.5rem] flex flex-col justify-center items-center text-center">
             <div className="text-3xl font-black text-orange-500">12</div>
             <div className="text-[10px] uppercase font-black tracking-widest opacity-40">Assessed Points</div>
          </div>
        </section>
      )}

      {/* Subjects Grid */}
      <section>
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-4xl font-black flex items-center gap-4">
            <Icons.Library className="text-orange-500" />
            Curriculum
          </h2>
          <div className="hidden md:flex gap-2">
            {['Semester 1', 'Semester 2', 'Core'].map(t => (
              <span key={t} className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold opacity-60 hover:opacity-100 transition-all cursor-pointer">{t}</span>
            ))}
          </div>
        </div>

        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {SUBJECTS.map((subject) => {
            const IconComponent = (Icons as any)[subject.icon] || Icons.Book;
            return (
              <motion.div
                key={subject.id}
                variants={item}
                whileHover={{ y: -10, scale: 1.02 }}
                onClick={() => navigate(`/subject/${subject.id}`)}
                className={`cursor-pointer p-10 rounded-[3rem] glass-card group transition-all relative overflow-hidden ${
                  isDarkMode ? 'hover:bg-orange-500/5' : 'hover:bg-orange-500/10'
                }`}
              >
                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-20 transition-all scale-150 rotate-12">
                  <IconComponent size={140} />
                </div>
                
                <div className={`w-16 h-16 rounded-2xl mb-8 flex items-center justify-center transition-all shadow-xl ${
                  isDarkMode ? 'bg-white/5 group-hover:bg-orange-500' : 'bg-orange-100 group-hover:bg-orange-500'
                }`}>
                  <IconComponent className={`w-8 h-8 transition-colors ${
                    isDarkMode ? 'text-orange-500 group-hover:text-white' : 'text-orange-600 group-hover:text-white'
                  }`} />
                </div>

                <h3 className="text-3xl font-black mb-4 group-hover:text-orange-500 transition-colors leading-tight">
                  {subject.name}
                </h3>
                
                <div className="flex items-center gap-6 mt-10">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase opacity-40">Credits</span>
                    <span className="font-bold text-orange-500">{subject.credits}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase opacity-40">Modules</span>
                    <span className="font-bold text-orange-500">{subject.modules.length}</span>
                  </div>
                </div>

                <div className="mt-10 pt-8 border-t border-white/10 flex items-center justify-between">
                  <span className="text-sm font-black text-orange-500 group-hover:translate-x-2 transition-transform inline-flex items-center gap-2">
                    Enter Subject <Icons.ChevronRight size={18} />
                  </span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </section>
    </div>
  );
};

export default Home;
