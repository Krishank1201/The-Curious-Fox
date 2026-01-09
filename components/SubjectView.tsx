
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SUBJECTS } from '../constants';
import * as Icons from 'lucide-react';

interface SubjectViewProps {
  isDarkMode: boolean;
}

const SubjectView: React.FC<SubjectViewProps> = ({ isDarkMode }) => {
  const { subjectId } = useParams<{ subjectId: string }>();
  const navigate = useNavigate();
  const subject = SUBJECTS.find(s => s.id === subjectId);

  if (!subject) return <div>Subject not found</div>;

  return (
    <div className="space-y-8">
      <button 
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-sm font-bold text-orange-500 hover:gap-3 transition-all"
      >
        <Icons.ArrowLeft size={18} /> Back to Dashboard
      </button>

      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-black mb-2">{subject.name}</h1>
          <p className="opacity-60 text-lg flex items-center gap-2">
            <Icons.Book size={20} className="text-orange-500" /> Syllabus Overview
          </p>
        </div>
        <div className="flex gap-4">
          <div className="px-6 py-3 rounded-2xl glass-card text-center">
             <div className="text-xs uppercase font-bold opacity-50 mb-1">Credits</div>
             <div className="text-2xl font-black text-orange-500">{subject.credits}</div>
          </div>
          <div className="px-6 py-3 rounded-2xl glass-card text-center">
             <div className="text-xs uppercase font-bold opacity-50 mb-1">Modules</div>
             <div className="text-2xl font-black text-orange-500">{subject.modules.length}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subject.modules.map((module, index) => (
          <motion.div
            key={module.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5 }}
            onClick={() => navigate(`/subject/${subject.id}/module/${module.id}`)}
            className={`p-6 rounded-[2rem] glass-card group cursor-pointer border-l-4 transition-all ${
               module.id === 'aiml-m4' ? 'border-l-orange-500' : 'border-l-transparent hover:border-l-orange-500'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
               <span className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center font-bold">
                 {index + 1}
               </span>
               <Icons.ChevronRight className="opacity-20 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-orange-500" />
            </div>
            <h3 className="text-xl font-bold mb-4 line-clamp-2 min-h-[3.5rem]">
              {module.name}
            </h3>
            <div className="flex items-center gap-2 text-sm opacity-50 font-medium">
               <Icons.Clock size={14} /> 4-5 Hours Est.
            </div>
            
            {module.id === 'aiml-m4' && (
              <div className="mt-4 flex gap-1">
                <span className="px-2 py-0.5 rounded-md bg-green-500/20 text-green-500 text-[10px] font-bold uppercase">Ready</span>
                <span className="px-2 py-0.5 rounded-md bg-orange-500/20 text-orange-500 text-[10px] font-bold uppercase">3 Topics</span>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SubjectView;
