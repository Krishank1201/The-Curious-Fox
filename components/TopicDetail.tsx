
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenAI } from '@google/genai';
import { AIML_MODULE_4_TOPICS } from '../constants';
import { runKMeans, runApriori, runPCA, KMeansResult, AprioriResult, PCAResult } from '../services/api';
import KMeansVisualization from './KMeansVisualization';
import AprioriVisualization from './AprioriVisualization';
import PCAVisualization from './PCAVisualization';
import ParameterPanel from './ParameterPanel';
import CodingLab from './CodingLab';
import TopicChatbot from './TopicChatbot';
import FoxRoadmap from './Roadmap/FoxRoadmap';
import AdaptiveQuizView from './Quiz/AdaptiveQuizView';
import { generateRoadmap, Roadmap } from '../services/roadmapEngine';
import { generateAdaptiveQuiz } from '../services/quizEngine';
import { AdaptiveQuiz } from '../types';
import * as Icons from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

interface TopicDetailProps {
  isDarkMode: boolean;
}

interface RunLog {
  id: number;
  dataset: string;
  k?: number;
  support?: number;
  confidence?: number;
  metric: number;
  time: string;
}

const TopicDetail: React.FC<TopicDetailProps> = ({ isDarkMode }) => {
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();
  const topic = AIML_MODULE_4_TOPICS.find(t => t.id === topicId);
  
  const [activeTab, setActiveTab] = useState<'overview' | 'materials' | 'video' | 'lab' | 'questions' | 'adaptive-quiz'>('overview');
  const [labSubTab, setLabSubTab] = useState<'visual' | 'coding'>('visual');
  const [activeQuestionSection, setActiveQuestionSection] = useState<string>('mcqs');
  const [downloadedIds, setDownloadedIds] = useState<Set<string>>(new Set());
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [activeCodingAlgo, setActiveCodingAlgo] = useState<'kmeans' | 'apriori' | 'pca' | null>(null);
  const [activeRoadmap, setActiveRoadmap] = useState<Roadmap | null>(null);
  const [activeAdaptiveQuiz, setActiveAdaptiveQuiz] = useState<AdaptiveQuiz | null>(null);
  const [masteryPoints, setMasteryPoints] = useState(0);

  // Lab States
  const [kmeansParams, setKmeansParams] = useState({ dataset: 'blobs', k: 3, maxiter: 100 });
  const [kmeansResults, setKmeansResults] = useState<KMeansResult | null>(null);
  const [aprioriParams, setAprioriParams] = useState({ dataset: 'grocery', support: 0.1, confidence: 0.6 });
  const [aprioriResults, setAprioriResults] = useState<AprioriResult | null>(null);
  const [pcaResults, setPcaResults] = useState<PCAResult | null>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [drFoxAnalysis, setDrFoxAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [runHistory, setRunHistory] = useState<RunLog[]>([]);

  if (!topic) return <div className="p-20 text-center font-black text-orange-500">Topic not found</div>;

  const handleStartRoadmap = () => {
    const savedUser = localStorage.getItem('curious_fox_user');
    const user = savedUser ? JSON.parse(savedUser) : null;
    if (user?.assessmentResult) {
      const roadmap = generateRoadmap(topic.id as any, user.assessmentResult);
      setActiveRoadmap(roadmap);
    } else {
      alert("Dr. Fox: I need your learning profile first! Head back to the dashboard to complete the assessment.");
      navigate('/assessment');
    }
  };

  const handleStartAdaptiveQuiz = () => {
    const savedUser = localStorage.getItem('curious_fox_user');
    const user = savedUser ? JSON.parse(savedUser) : null;
    if (user?.assessmentResult) {
      const quiz = generateAdaptiveQuiz(topic.id, user.assessmentResult, 'L3');
      setActiveAdaptiveQuiz(quiz);
    } else {
      alert("Dr. Fox: I need your learning profile first!");
      navigate('/assessment');
    }
  };

  const analyzeWithDrFox = async (results: any, type: 'kmeans' | 'apriori' | 'pca') => {
    setIsAnalyzing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      let prompt = "";
      
      if (type === 'kmeans') {
        prompt = `You are Dr. Fox 🦊. Interpret these K-Means results: Inertia=${results.metrics.inertia.toFixed(2)}, Silhouette=${results.metrics.silhouette_score.toFixed(3)}. Provide 3 paragraphs of insights.`;
      } else if (type === 'apriori') {
        prompt = `You are Dr. Fox 🦊. Interpret these Apriori results: Rules Found=${results.metrics.nrules}, Max Lift=${results.metrics.maxlift.toFixed(2)}. Discuss rule quality and suggest parameter tweaks. Use emojis.`;
      } else {
        prompt = `You are Dr. Fox 🦊. Interpret these PCA results: PC1 Variance=${(results.explained_variance[0]*100).toFixed(1)}%, Cumulative Variance=${(results.cumulative_variance[1]*100).toFixed(1)}%. Explain why dimensionality reduction is successful here.`;
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });
      setDrFoxAnalysis(response.text);
    } catch (err) {
      setDrFoxAnalysis("Dr. Fox: AI analysis encountered a minor glitch. Your metrics look promising—try adjusting parameters to refine the discovery!");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRunLab = async () => {
    setIsLoading(true);
    setDrFoxAnalysis(null);
    try {
      if (topic.id === 'kmeans') {
        const data = await runKMeans(kmeansParams);
        setKmeansResults(data);
        setRunHistory(prev => [{
          id: prev.length + 1,
          dataset: kmeansParams.dataset,
          k: kmeansParams.k,
          metric: data.metrics.silhouette_score,
          time: new Date().toLocaleTimeString()
        }, ...prev]);
        await analyzeWithDrFox(data, 'kmeans');
      } else if (topic.id === 'apriori') {
        const data = await runApriori(aprioriParams);
        setAprioriResults(data);
        setRunHistory(prev => [{
          id: prev.length + 1,
          dataset: aprioriParams.dataset,
          support: aprioriParams.support,
          confidence: aprioriParams.confidence,
          metric: data.metrics.nrules,
          time: new Date().toLocaleTimeString()
        }, ...prev]);
        await analyzeWithDrFox(data, 'apriori');
      } else if (topic.id === 'pca') {
        const data = await runPCA({ dataset: 'synthetic' });
        setPcaResults(data);
        setRunHistory(prev => [{
          id: prev.length + 1,
          dataset: '3D Point Cloud',
          metric: data.explained_variance[0],
          time: new Date().toLocaleTimeString()
        }, ...prev]);
        await analyzeWithDrFox(data, 'pca');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'lab' && !kmeansResults && !aprioriResults && !pcaResults && labSubTab === 'visual') {
      handleRunLab();
    }
  }, [activeTab, labSubTab]);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Icons.Info },
    { id: 'materials', label: 'Study Materials', icon: Icons.FileText },
    { id: 'video', label: 'Recommended Videos', icon: Icons.Youtube },
    { id: 'lab', label: 'Practical Lab', icon: Icons.FlaskConical },
    { id: 'questions', label: 'Question Bank', icon: Icons.HelpCircle },
    { id: 'adaptive-quiz', label: 'Dr. Fox Quiz', icon: Icons.BrainCircuit },
  ] as const;

  const toggleDownload = (id: string) => {
    const next = new Set(downloadedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setDownloadedIds(next);
  };

  const renderQuestionBank = () => {
    const bank = topic.questionBank;
    if (!bank) return <div className="text-center opacity-50 py-12">No detailed questions available for this topic.</div>;
    
    const renderSectionContent = () => {
      const current = bank[activeQuestionSection as keyof typeof bank];
      if (!current || (Array.isArray(current) && current.length === 0)) {
        return <div className="text-center py-20 opacity-30 italic">No items found in this category for {topic.name}.</div>;
      }

      if (activeQuestionSection === 'mcqs') {
        return (current as any[]).map(q => (
          <div key={q.id} className="p-6 rounded-2xl glass-card border border-white/5 space-y-4 mb-4">
            <h4 className="font-bold text-lg">{q.question}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {q.options.map((opt: string, i: number) => (
                <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/5 text-sm">{String.fromCharCode(65 + i)}. {opt}</div>
              ))}
            </div>
            <button onClick={() => setExpandedId(expandedId === q.id ? null : q.id)} className="text-orange-500 text-xs font-black uppercase tracking-widest flex items-center gap-1">
              {expandedId === q.id ? 'Hide Answer' : 'Show Answer'} <Icons.ChevronDown size={14} className={expandedId === q.id ? 'rotate-180 transition-transform' : ''} />
            </button>
            {expandedId === q.id && <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-sm italic">{q.solution}</div>}
          </div>
        ));
      }

      return (current as any[]).map((q: any) => (
        <div key={q.id} className="p-6 rounded-2xl glass-card border border-white/5 space-y-4 mb-4">
          <h4 className="font-bold text-lg">{q.question || q.title || q.term}</h4>
          {q.context && <p className="text-sm opacity-60 italic mb-2">{q.context}</p>}
          {q.definition && <p className="text-sm opacity-60 mb-2">{q.definition}</p>}
          <button onClick={() => setExpandedId(expandedId === q.id ? null : q.id)} className="text-orange-500 text-xs font-black uppercase tracking-widest flex items-center gap-1">
            {expandedId === q.id ? 'Hide Solution' : 'Reveal Solution'} <Icons.ChevronDown size={14} className={expandedId === q.id ? 'rotate-180 transition-transform' : ''} />
          </button>
          {expandedId === q.id && (
            <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20 text-sm">
              <span className="font-black text-[10px] uppercase opacity-40 block mb-2">Dr. Fox Solution Key</span>
              {q.answer || q.solution || q.explanation}
              {q.tasks && (
                <ul className="mt-4 list-disc list-inside space-y-1">
                  {q.tasks.map((t: string, i: number) => <li key={i}>{t}</li>)}
                </ul>
              )}
            </div>
          )}
        </div>
      ));
    };

    const questionSections = [
      { id: 'mcqs', label: "MCQ's", icon: Icons.ListTodo },
      { id: 'fillBlanks', label: "Fill in Blanks", icon: Icons.Type },
      { id: 'matchFollowing', label: "Match Items", icon: Icons.GitCompare },
      { id: 'trueFalse', label: "True/False", icon: Icons.ToggleLeft },
      { id: 'shortAnswers', label: "Short Answers", icon: Icons.AlignLeft },
      { id: 'longAnswers', label: "Long Answers", icon: Icons.Text },
      { id: 'numerical', label: "Numerical", icon: Icons.Calculator },
      { id: 'scenarios', label: "Scenarios", icon: Icons.Briefcase },
    ];

    return (
      <div className="space-y-8">
        <div className="flex flex-wrap gap-2 pb-4 border-b border-white/10">
          {questionSections.map(section => (
            <button
              key={section.id}
              onClick={() => {
                setActiveQuestionSection(section.id);
                setExpandedId(null);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeQuestionSection === section.id 
                  ? 'bg-orange-500 text-white shadow-lg' 
                  : 'bg-white/5 hover:bg-white/10 text-orange-500'
              }`}
            >
              <section.icon size={14} />
              {section.label}
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={activeQuestionSection} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            {renderSectionContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    );
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      case 'Intermediate': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
      case 'Expert': return 'text-red-500 bg-red-500/10 border-red-500/20';
      default: return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
    }
  };

  return (
    <div className="space-y-8">
      {/* Conditional Rendering of Chatbot */}
      {(topic.id === 'kmeans' || topic.id === 'pca' || topic.id === 'apriori') && (
        <TopicChatbot topicName={topic.name} isDarkMode={isDarkMode} />
      )}

      <AnimatePresence>
        {activeCodingAlgo && (
          <CodingLab 
            algorithm={activeCodingAlgo} 
            isDarkMode={isDarkMode} 
            onClose={() => setActiveCodingAlgo(null)} 
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {activeRoadmap && (
          <FoxRoadmap 
            initialRoadmap={activeRoadmap} 
            isDarkMode={isDarkMode} 
            onClose={() => setActiveRoadmap(null)} 
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {activeAdaptiveQuiz && (
          <div className="fixed inset-0 z-[75] bg-black/95 flex flex-col items-center justify-center p-4">
             <AdaptiveQuizView 
                quiz={activeAdaptiveQuiz} 
                onClose={() => setActiveAdaptiveQuiz(null)}
                isDarkMode={isDarkMode}
                onComplete={(score, total) => {
                   setMasteryPoints(prev => prev + (score * 20));
                   setActiveAdaptiveQuiz(null);
                   setActiveTab('overview');
                }}
             />
          </div>
        )}
      </AnimatePresence>

      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm font-bold text-orange-500 hover:gap-3 transition-all" >
        <Icons.ArrowLeft size={18} /> Back to Module
      </button>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-72 flex-shrink-0">
          <div className="sticky top-24 space-y-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all ${
                  activeTab === tab.id ? 'bg-orange-500 text-white shadow-lg' : 'hover:bg-orange-500/10 text-orange-500/70 border border-transparent'
                }`}
              >
                <tab.icon size={20} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-grow min-h-[600px]">
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-8 md:p-12 rounded-[2.5rem] glass-card border border-white/10">
              {activeTab === 'overview' && (
                <div className="space-y-12">
                  <div className="flex flex-col md:flex-row items-start justify-between gap-8">
                    <div className="space-y-6">
                      <h2 className="text-4xl font-black">{topic.name}</h2>
                      <div className="h-1 w-20 bg-orange-500 rounded-full"></div>
                      <p className="text-xl leading-relaxed opacity-80 max-w-2xl">{topic.overview}</p>
                      
                      <div className="flex gap-4">
                         <div className="p-4 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center gap-3">
                            <Icons.Award className="text-orange-500" size={24}/>
                            <div>
                               <div className="text-[10px] font-black uppercase opacity-40">Topic Mastery</div>
                               <div className="font-black text-orange-500">{masteryPoints} Pts</div>
                            </div>
                         </div>
                      </div>
                    </div>
                    
                    <div className="p-8 rounded-[3rem] glass-card border-2 border-orange-500/20 bg-orange-500/5 min-w-[300px]">
                       <div className="flex items-center gap-3 mb-4 text-orange-500">
                         <Icons.Compass size={24} />
                         <h4 className="font-black uppercase text-xs tracking-widest">Personalized Roadmap</h4>
                       </div>
                       <p className="text-xs opacity-60 mb-6 font-medium leading-relaxed">Let Dr. Fox curate a path through {topic.name} specifically mapped to your learning style and goals.</p>
                       <button 
                         onClick={handleStartRoadmap}
                         className="w-full py-4 bg-orange-500 text-white rounded-2xl font-black shadow-xl hover:bg-orange-600 active:scale-95 transition-all flex items-center justify-center gap-2"
                       >
                         <Icons.Map /> Curate My Path
                       </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'materials' && (
                <div className="space-y-8">
                  <h2 className="text-3xl font-black flex items-center gap-3"><Icons.FileText className="text-orange-500" /> Curated Resources</h2>
                  <div className="grid gap-4">
                    {topic.materials && topic.materials.length > 0 ? (
                      topic.materials.map(mat => (
                        <div key={mat.id} className="p-6 rounded-2xl glass-card border border-white/5 flex items-center justify-between group bg-white/5 hover:bg-white/10 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${mat.type === 'pdf' ? 'bg-red-500/10 text-red-500' : 'bg-orange-500/10 text-orange-500'}`}>
                              {mat.type === 'pdf' ? <Icons.FileText /> : <Icons.Presentation />}
                            </div>
                            <div>
                              <h4 className="font-bold text-white">{mat.title}</h4>
                              <span className="text-[10px] uppercase font-black opacity-40">{mat.type} DOCUMENT</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <a href={mat.url} target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-orange-500 transition-all border border-white/10"><Icons.Eye size={18} /></a>
                            <button onClick={() => toggleDownload(mat.id)} className={`p-3 rounded-xl transition-all border border-white/10 ${downloadedIds.has(mat.id) ? 'bg-green-500/20 text-green-500 border-green-500/30' : 'bg-orange-500/10 text-orange-500 hover:bg-orange-500 hover:text-white'}`}>
                              {downloadedIds.has(mat.id) ? <Icons.Check size={18} /> : <Icons.Download size={18} />}
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12 opacity-40 font-bold italic">No study materials listed for this topic yet.</div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'video' && (
                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-black flex items-center gap-3"><Icons.PlayCircle className="text-orange-500" /> Recommended Videos</h2>
                    <div className="px-4 py-2 rounded-xl bg-orange-500/10 text-orange-500 text-[10px] font-black uppercase tracking-widest border border-orange-500/20">
                      Engineering Lectures
                    </div>
                  </div>
                  <div className="grid gap-4">
                    {topic.videos ? (
                      <div className="overflow-hidden rounded-3xl border border-white/10 bg-black/20">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-white/5 text-[10px] uppercase font-black tracking-widest opacity-40">
                              <th className="px-6 py-4">Level</th>
                              <th className="px-6 py-4">Video Lesson</th>
                              <th className="px-6 py-4">Duration</th>
                              <th className="px-6 py-4 text-center">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5">
                            {topic.videos.map(vid => (
                              <tr key={vid.id} className="group hover:bg-white/5 transition-all">
                                <td className="px-6 py-4"><span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${getLevelColor(vid.level)}`}>{vid.level}</span></td>
                                <td className="px-6 py-4 font-bold text-sm">{vid.title}</td>
                                <td className="px-6 py-4 text-xs font-bold opacity-50">{vid.duration}</td>
                                <td className="px-6 py-4 text-center">
                                  <a href={vid.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-orange-500/10 text-orange-500 hover:bg-orange-500 hover:text-white transition-all"><Icons.ExternalLink size={14} /></a>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : <div className="aspect-video w-full rounded-[2rem] overflow-hidden bg-black shadow-2xl"><iframe className="w-full h-full" src={topic.videoUrl} title="Video player" allowFullScreen></iframe></div>}
                  </div>
                </div>
              )}

              {activeTab === 'lab' && (
                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-3xl font-black">Practical Lab</h2>
                      <p className="text-sm opacity-50 font-bold uppercase tracking-widest mt-1">Experimental Sandbox</p>
                    </div>
                    
                    <div className="flex p-1 bg-white/5 rounded-2xl border border-white/10">
                      <button 
                        onClick={() => setLabSubTab('visual')}
                        className={`px-6 py-2 rounded-xl text-xs font-black uppercase transition-all flex items-center gap-2 ${labSubTab === 'visual' ? 'bg-orange-500 text-white' : 'opacity-40 hover:opacity-100'}`}
                      >
                        <Icons.Box size={14} /> Sandbox
                      </button>
                      <button 
                        onClick={() => setLabSubTab('coding')}
                        className={`px-6 py-2 rounded-xl text-xs font-black uppercase transition-all flex items-center gap-2 ${labSubTab === 'coding' ? 'bg-orange-500 text-white' : 'opacity-40 hover:opacity-100'}`}
                      >
                        <Icons.Terminal size={14} /> Coding Lab
                      </button>
                    </div>
                  </div>

                  {labSubTab === 'visual' ? (
                    <div className="space-y-12">
                      {topic.id === 'kmeans' ? (
                        <div className="space-y-8">
                          <ParameterPanel params={kmeansParams} setParams={setKmeansParams} onRun={handleRunLab} isLoading={isLoading} />
                          <div className="h-[500px] w-full bg-black/20 rounded-[2.5rem] border border-white/10 relative overflow-hidden shadow-inner">
                            <KMeansVisualization vizData={kmeansResults?.vizdata} metrics={kmeansResults?.metrics} isDarkMode={isDarkMode} />
                          </div>
                        </div>
                      ) : topic.id === 'apriori' ? (
                        <AprioriVisualization 
                          data={aprioriResults} 
                          isLoading={isLoading} 
                          currentParams={aprioriParams}
                          onParamsChange={(p) => {
                            setAprioriParams(p);
                            handleRunLab();
                          }}
                        />
                      ) : topic.id === 'pca' ? (
                        <PCAVisualization 
                          data={pcaResults} 
                          isLoading={isLoading} 
                          isDarkMode={isDarkMode}
                        />
                      ) : (
                        <div className="p-20 text-center glass-card rounded-[2rem] border border-white/10">
                          <Icons.Construction className="mx-auto text-orange-500/20 mb-4 w-12 h-12" />
                          <p className="opacity-40 font-bold">The Visual Sandbox for {topic.name} is under construction.</p>
                        </div>
                      )}

                      <div className="grid md:grid-cols-2 gap-8">
                        <div className="p-8 rounded-[2.5rem] glass-card border border-orange-500/20 bg-orange-500/5 flex flex-col h-full min-h-[350px]">
                          <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center text-white shadow-lg"><Icons.Bot /></div>
                              <div><h4 className="font-black text-sm uppercase tracking-widest text-white">Dr. Fox Analysis</h4><span className="text-[10px] opacity-40 font-bold">Neural Insight Protocol</span></div>
                            </div>
                            {isAnalyzing && <Icons.Loader className="animate-spin text-orange-500" />}
                          </div>
                          <div className="flex-grow text-sm opacity-80 leading-relaxed italic overflow-y-auto custom-scrollbar pr-2">
                            {drFoxAnalysis ? <p className="whitespace-pre-line text-white">{drFoxAnalysis}</p> : <div className="h-full flex flex-col items-center justify-center opacity-30 text-center"><Icons.Sparkles className="mb-2"/><p>Run the sandbox to engage <br/>Dr. Fox's analytical cores.</p></div>}
                          </div>
                        </div>

                        <div className="p-8 rounded-[2.5rem] glass-card border border-white/10 flex flex-col h-full min-h-[350px]">
                          <h4 className="font-black text-sm uppercase tracking-widest mb-6 flex items-center gap-2 text-white">
                            <Icons.TrendingUp className="text-orange-500"/> 
                            {topic.id === 'kmeans' ? 'Silhouette Score Trend' : topic.id === 'pca' ? 'Primary PC Variance' : 'Pattern Mining Volume'}
                          </h4>
                          <div className="flex-grow">
                            {runHistory.length > 1 ? (
                              <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={[...runHistory].reverse()}>
                                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                  <XAxis dataKey="id" hide />
                                  <YAxis hide />
                                  <Tooltip contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '12px', fontSize: '10px' }} />
                                  <Line type="monotone" dataKey="metric" stroke="#FF7E06" strokeWidth={3} dot={{ fill: '#FF7E06', r: 4 }} activeDot={{ r: 6 }} />
                                </LineChart>
                              </ResponsiveContainer>
                            ) : <div className="h-full flex items-center justify-center opacity-30 text-xs font-bold uppercase">Awaiting multiple runs...</div>}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="p-12 rounded-[3rem] glass-card border border-white/10 bg-orange-500/5 text-center">
                        <Icons.Code size={48} className="text-orange-500 mx-auto mb-6" />
                        <h3 className="text-3xl font-black mb-4">Neural Code Interpreter</h3>
                        <p className="max-w-xl mx-auto opacity-60 mb-10">
                          Step out of the visual interface and into the IDE. Master the implementation logic for {topic.name} using our AI-guided Python coding environment.
                        </p>
                        <button 
                          onClick={() => setActiveCodingAlgo(topic.id as any)}
                          className="px-12 py-4 bg-orange-500 text-white rounded-[2rem] font-black shadow-xl shadow-orange-500/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-3 mx-auto"
                        >
                          <Icons.Play size={20} /> Open Coding Lab
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'questions' && (
                <div className="space-y-8">
                  <h2 className="text-3xl font-black flex items-center gap-3"><Icons.HelpCircle className="text-orange-500" /> Mastery Exam Prep</h2>
                  {renderQuestionBank()}
                </div>
              )}

              {activeTab === 'adaptive-quiz' && (
                <div className="space-y-8 text-center py-20">
                  <Icons.BrainCircuit size={64} className="text-orange-500 mx-auto mb-6 animate-pulse" />
                  <h2 className="text-4xl font-black mb-4">The Adaptive Proving Ground</h2>
                  <p className="max-w-xl mx-auto opacity-60 text-lg mb-10">
                    Dr. Fox will tailor a sequence of questions designed to test your actual cognitive depth on {topic.name}. Performance here directly impacts your global mastery rank.
                  </p>
                  <button 
                    onClick={handleStartAdaptiveQuiz}
                    className="px-16 py-5 bg-orange-500 text-white rounded-[2rem] font-black shadow-2xl hover:bg-orange-600 transition-all flex items-center gap-3 mx-auto active:scale-95"
                  >
                    <Icons.Zap /> Begin Evaluation
                  </button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default TopicDetail;
