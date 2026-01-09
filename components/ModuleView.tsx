
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SUBJECTS, AIML_MODULE_4_TOPICS } from '../constants';
import * as Icons from 'lucide-react';

interface ModuleViewProps {
  isDarkMode: boolean;
}

const ModuleView: React.FC<ModuleViewProps> = ({ isDarkMode }) => {
  const { subjectId, moduleId } = useParams<{ subjectId: string, moduleId: string }>();
  const navigate = useNavigate();
  
  const subject = SUBJECTS.find(s => s.id === subjectId);
  const module = subject?.modules.find(m => m.id === moduleId);

  if (!subject || !module) return <div>Module not found</div>;

  // For this demo, we only have topics for AIML Module 4
  const hasTopics = moduleId === 'aiml-m4';
  const topics = hasTopics ? AIML_MODULE_4_TOPICS : [];

  return (
    <div className="space-y-8">
      <button 
        onClick={() => navigate(`/subject/${subjectId}`)}
        className="flex items-center gap-2 text-sm font-bold text-orange-500 hover:gap-3 transition-all"
      >
        <Icons.ArrowLeft size={18} /> Back to Modules
      </button>

      <div className="p-10 rounded-[2.5rem] glass-card relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Icons.Layout size={120} />
        </div>
        <div className="relative z-10">
          <span className="text-orange-500 font-bold uppercase tracking-widest text-xs mb-2 block">
            {subject.name}
          </span>
          <h1 className="text-4xl font-black mb-4">{module.name}</h1>
          <p className="max-w-2xl opacity-70 leading-relaxed">
            This module covers the core principles and methodologies related to {module.name.toLowerCase()}. 
            Dive into the topics below to start your deep learning session.
          </p>
        </div>
      </div>

      {hasTopics ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {topics.map((topic, index) => (
            <motion.div
              key={topic.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              onClick={() => navigate(`/topic/${topic.id}`)}
              className="p-8 rounded-[2rem] glass-card cursor-pointer group flex flex-col h-full hover:shadow-2xl hover:shadow-orange-500/10 transition-all border-t border-white/10"
            >
              <div className="w-14 h-14 rounded-2xl bg-orange-500 flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform">
                <Icons.Sparkles size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-4">{topic.name}</h3>
              <p className="opacity-60 text-sm mb-8 flex-grow leading-relaxed">
                {topic.overview.substring(0, 100)}...
              </p>
              
              <div className="grid grid-cols-2 gap-3">
                 <div className="p-3 rounded-xl bg-white/5 flex flex-col items-center gap-1 border border-white/5">
                   <Icons.PlayCircle className="text-orange-500 w-5 h-5" />
                   <span className="text-[10px] font-bold uppercase opacity-50">Videos</span>
                 </div>
                 <div className="p-3 rounded-xl bg-white/5 flex flex-col items-center gap-1 border border-white/5">
                   <Icons.ClipboardList className="text-orange-500 w-5 h-5" />
                   <span className="text-[10px] font-bold uppercase opacity-50">Quiz</span>
                 </div>
              </div>

              <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between text-orange-500 font-bold">
                 <span>Start Learning</span>
                 <Icons.ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="p-20 text-center glass-card rounded-[2.5rem]">
          <Icons.Construction className="mx-auto w-16 h-16 text-orange-500/50 mb-4 animate-bounce" />
          <h2 className="text-2xl font-bold opacity-50">Content for this module is being curated.</h2>
          <p className="opacity-30 mt-2">Check back soon! Curious Fox is busy fetching the data.</p>
        </div>
      )}
    </div>
  );
};

export default ModuleView;
