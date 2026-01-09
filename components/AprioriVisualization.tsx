
import React, { useState, useMemo, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';
import { AprioriResult } from '../services/api';

interface AprioriVisualizationProps {
  data: AprioriResult | null;
  isLoading: boolean;
  onParamsChange: (params: { support: number; confidence: number; dataset: string }) => void;
  currentParams: { support: number; confidence: number; dataset: string };
}

type Phase = 'setup' | 'threshold' | 'discovery' | 'dashboard' | 'network';
type DiscoveryStep = 'frequent' | 'pairs' | 'rules';

const AprioriVisualization: React.FC<AprioriVisualizationProps> = ({ data, isLoading, onParamsChange, currentParams }) => {
  const [phase, setPhase] = useState<Phase>('setup');
  const [discoveryStep, setDiscoveryStep] = useState<DiscoveryStep>('frequent');
  const [xp, setXP] = useState(0);
  const [achievements, setAchievements] = useState<string[]>([]);
  const [activeAchievement, setActiveAchievement] = useState<string | null>(null);
  const mountRef = useRef<HTMLDivElement>(null);

  // Phases Meta
  const phases = [
    { id: 'setup', label: 'Evidence Room', icon: Icons.Archive },
    { id: 'threshold', label: 'Control Desk', icon: Icons.Sliders },
    { id: 'discovery', label: 'Investigation Board', icon: Icons.Search },
    { id: 'dashboard', label: 'Analyst Table', icon: Icons.LayoutDashboard },
    { id: 'network', label: 'Crime Network', icon: Icons.Share2 },
  ];

  // XP & Achievement Logic
  const addXP = (amount: number, achievement?: string) => {
    setXP(prev => prev + amount);
    if (achievement && !achievements.includes(achievement)) {
      setAchievements(prev => [...prev, achievement]);
      setActiveAchievement(achievement);
      setTimeout(() => setActiveAchievement(null), 3000);
    }
  };

  useEffect(() => {
    if (phase === 'discovery') addXP(100, 'Detective Intern');
    if (phase === 'dashboard') addXP(250, 'Data Profiler');
    if (phase === 'network') addXP(500, 'Master Detective');
  }, [phase]);

  // Three.js Network Graph Logic for Phase 5
  useEffect(() => {
    if (phase !== 'network' || !mountRef.current || !data) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 20;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    mountRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xff7e06, 1);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    // Nodes (Items)
    const nodeMeshes: THREE.Mesh[] = [];
    const itemMap = new Map<string, THREE.Vector3>();

    data.vizdata.items.forEach((item, i) => {
      const radius = 0.5 + (item.count / data.transactionsCount) * 2;
      const geometry = new THREE.SphereGeometry(radius, 32, 32);
      const material = new THREE.MeshPhongMaterial({ 
        color: item.color, 
        emissive: item.color,
        emissiveIntensity: 0.2,
        shininess: 100 
      });
      const mesh = new THREE.Mesh(geometry, material);
      
      const phi = Math.acos(-1 + (2 * i) / data.vizdata.items.length);
      const theta = Math.sqrt(data.vizdata.items.length * Math.PI) * phi;
      mesh.position.setFromSphericalCoords(10, phi, theta);
      
      scene.add(mesh);
      nodeMeshes.push(mesh);
      itemMap.set(item.name, mesh.position.clone());
    });

    // Edges (Rules)
    data.vizdata.rules.forEach((rule) => {
      const start = itemMap.get(rule.antecedent);
      const end = itemMap.get(rule.consequent);
      if (start && end) {
        const direction = new THREE.Vector3().subVectors(end, start);
        const length = direction.length();
        
        // Arrow Helper for directional rules
        const arrow = new THREE.ArrowHelper(
          direction.clone().normalize(),
          start,
          length,
          rule.confidence > 0.8 ? 0x22c55e : 0xff7e06,
          0.5,
          0.3
        );
        scene.add(arrow);

        // Connection line with thickness relative to confidence
        const lineGeo = new THREE.BufferGeometry().setFromPoints([start, end]);
        const lineMat = new THREE.LineBasicMaterial({ 
          color: rule.confidence > 0.8 ? 0x22c55e : 0xff7e06, 
          transparent: true, 
          opacity: rule.confidence 
        });
        const line = new THREE.Line(lineGeo, lineMat);
        scene.add(line);
      }
    });

    let frame: number;
    const animate = () => {
      frame = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frame);
      if (mountRef.current) mountRef.current.innerHTML = '';
      renderer.dispose();
    };
  }, [phase, data]);

  const renderPhaseContent = () => {
    switch (phase) {
      case 'setup':
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12 py-10">
            <div className="text-center max-w-2xl mx-auto">
              <Icons.Archive className="mx-auto text-orange-500 mb-6" size={48} />
              <h2 className="text-4xl font-black mb-4">Phase 1: Evidence Selection</h2>
              <p className="opacity-60 text-lg">Dr. Fox: "Every investigation starts with data. Choose your transactional landscape to begin the hunt for patterns."</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { id: 'grocery', name: 'Retail Grocery', icon: Icons.ShoppingCart, desc: 'Everyday transactions. Bread, Milk, and the classic beer/diaper myth.' },
                { id: 'ecommerce', name: 'E-Commerce Tech', icon: Icons.Monitor, desc: 'Laptops, keyboards, and high-tech peripheral bundles.' },
                { id: 'bookstore', name: 'Academic Bookstore', icon: Icons.BookOpen, desc: 'Textbooks, stationery, and research journals.' }
              ].map(dataset => (
                <button
                  key={dataset.id}
                  onClick={() => onParamsChange({ ...currentParams, dataset: dataset.id })}
                  className={`p-8 rounded-[3rem] glass-card border-2 text-left transition-all group ${
                    currentParams.dataset === dataset.id ? 'border-orange-500 bg-orange-500/5' : 'border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all ${
                    currentParams.dataset === dataset.id ? 'bg-orange-500 text-white' : 'bg-white/5 text-orange-500 group-hover:bg-white/10'
                  }`}>
                    <dataset.icon size={28} />
                  </div>
                  <h3 className="text-2xl font-black mb-3">{dataset.name}</h3>
                  <p className="text-sm opacity-50 leading-relaxed">{dataset.desc}</p>
                </button>
              ))}
            </div>
            <div className="flex justify-center">
              <button onClick={() => setPhase('threshold')} className="px-16 py-5 bg-orange-500 text-white rounded-[2rem] font-black shadow-2xl hover:bg-orange-600 transition-all flex items-center gap-3">
                Enter Control Desk <Icons.ArrowRight />
              </button>
            </div>
          </motion.div>
        );

      case 'threshold':
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12 py-10">
            <div className="text-center max-w-2xl mx-auto">
              <Icons.Sliders className="mx-auto text-orange-500 mb-6" size={48} />
              <h2 className="text-4xl font-black mb-4">Phase 2: Threshold Calibration</h2>
              <p className="opacity-60 text-lg">Dr. Fox: "Not all evidence is strong. These sliders control the 'fog'. Higher support filters noise; higher confidence finds truth."</p>
            </div>
            <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
              <div className="space-y-8 p-10 rounded-[3rem] glass-card border border-white/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5"><Icons.Zap size={100} /></div>
                <div>
                  <label className="flex justify-between font-black uppercase text-xs mb-4 tracking-widest">
                    <span>Minimum Support</span>
                    <span className="text-orange-500">{(currentParams.support * 100).toFixed(0)}%</span>
                  </label>
                  <input type="range" min="0.01" max="0.5" step="0.01" value={currentParams.support} onChange={(e) => onParamsChange({...currentParams, support: parseFloat(e.target.value)})} className="w-full accent-orange-500 h-2 bg-white/10 rounded-full appearance-none cursor-pointer" />
                  <p className="mt-4 text-xs opacity-40 italic">How common must an item be? (Min {Math.round(currentParams.support * (data?.transactionsCount || 100))} transactions)</p>
                </div>
                <div>
                  <label className="flex justify-between font-black uppercase text-xs mb-4 tracking-widest">
                    <span>Minimum Confidence</span>
                    <span className="text-orange-500">{(currentParams.confidence * 100).toFixed(0)}%</span>
                  </label>
                  <input type="range" min="0.1" max="0.95" step="0.05" value={currentParams.confidence} onChange={(e) => onParamsChange({...currentParams, confidence: parseFloat(e.target.value)})} className="w-full accent-orange-500 h-2 bg-white/10 rounded-full appearance-none cursor-pointer" />
                  <p className="mt-4 text-xs opacity-40 italic">How reliable must the prediction be? (A predicts B with this probability)</p>
                </div>
              </div>
              <div className="flex flex-col justify-center gap-6">
                <div className="p-8 rounded-[2.5rem] bg-orange-500/10 border border-orange-500/20">
                  <h4 className="font-black text-sm uppercase text-orange-500 mb-3">Detective Intel</h4>
                  <ul className="space-y-3 text-sm opacity-70">
                    <li className="flex gap-2"><span>🔍</span> Low Support = More evidence, but more noise.</li>
                    <li className="flex gap-2"><span>🎯</span> High Confidence = Stronger rules, fewer candidates.</li>
                    <li className="flex gap-2"><span>🦊</span> Try "Novice" levels for a dense network graph!</li>
                  </ul>
                </div>
                <div className="flex gap-3">
                  {['Novice', 'Pro', 'Expert'].map((l, i) => (
                    <button key={l} onClick={() => onParamsChange({...currentParams, support: [0.05, 0.15, 0.3][i], confidence: [0.4, 0.6, 0.8][i]})} className="flex-1 py-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-orange-500 hover:text-white transition-all font-black text-[10px] uppercase">
                      {l}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <button onClick={() => setPhase('discovery')} className="px-16 py-5 bg-orange-500 text-white rounded-[2rem] font-black shadow-2xl hover:bg-orange-600 transition-all">
                Start Discovery Phase
              </button>
            </div>
          </motion.div>
        );

      case 'discovery':
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-black">Investigation Board</h2>
                <div className="flex gap-1 mt-2">
                  {(['frequent', 'pairs', 'rules'] as DiscoveryStep[]).map(s => (
                    <div key={s} className={`h-1.5 w-16 rounded-full transition-all ${discoveryStep === s ? 'bg-orange-500' : 'bg-white/10'}`} />
                  ))}
                </div>
              </div>
              <div className="flex gap-4">
                <button onClick={() => setDiscoveryStep('frequent')} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${discoveryStep === 'frequent' ? 'bg-orange-500 text-white' : 'bg-white/5 opacity-40'}`}>1. Frequencies</button>
                <button onClick={() => setDiscoveryStep('pairs')} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${discoveryStep === 'pairs' ? 'bg-orange-500 text-white' : 'bg-white/5 opacity-40'}`}>2. Pair Sets</button>
                <button onClick={() => setDiscoveryStep('rules')} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${discoveryStep === 'rules' ? 'bg-orange-500 text-white' : 'bg-white/5 opacity-40'}`}>3. Rule Gen</button>
              </div>
            </div>

            <div className="min-h-[400px]">
              <AnimatePresence mode="wait">
                {discoveryStep === 'frequent' && (
                  <motion.div key="freq" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="grid gap-4">
                    {data?.vizdata.items.map((item, i) => (
                      <div key={item.name} className="p-6 rounded-[2rem] glass-card border border-white/5 flex items-center justify-between group">
                        <div className="flex items-center gap-6">
                          <div className="w-16 h-16 rounded-2xl bg-black/40 flex items-center justify-center text-4xl border border-white/5 transition-transform group-hover:scale-110">{item.emoji}</div>
                          <div>
                            <h4 className="font-black text-xl">{item.name}</h4>
                            <p className="text-[10px] font-black uppercase opacity-40 tracking-widest">{item.count} Transactions</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-10 text-right">
                          <div>
                            <div className="text-[10px] font-black uppercase opacity-40">Support</div>
                            <div className="text-2xl font-black text-orange-500">{(item.count / data.transactionsCount * 100).toFixed(1)}%</div>
                          </div>
                          <div className={`px-4 py-1 rounded-md text-[10px] font-black uppercase border ${item.count / data.transactionsCount >= currentParams.support ? 'bg-emerald-500/20 text-emerald-500 border-emerald-500/20' : 'bg-red-500/20 text-red-500 border-red-500/20 opacity-50'}`}>
                            {item.count / data.transactionsCount >= currentParams.support ? 'Frequent' : 'Filtered'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}

                {discoveryStep === 'pairs' && (
                  <motion.div key="pairs" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="grid md:grid-cols-2 gap-4">
                    {data?.vizdata.pairs.map((pair, i) => (
                      <div key={i} className="p-6 rounded-3xl glass-card border border-white/10 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex -space-x-4">
                            <div className="w-12 h-12 rounded-full bg-black border-2 border-white/10 flex items-center justify-center text-2xl z-10">{data.vizdata.items.find(it => it.name === pair.items[0])?.emoji}</div>
                            <div className="w-12 h-12 rounded-full bg-black border-2 border-white/10 flex items-center justify-center text-2xl">{data.vizdata.items.find(it => it.name === pair.items[1])?.emoji}</div>
                          </div>
                          <div>
                            <h4 className="font-black text-sm">{pair.items[0]} + {pair.items[1]}</h4>
                            <p className="text-[10px] font-black opacity-30 uppercase">{pair.count} Shared Purchases</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-black text-orange-500">{(pair.support * 100).toFixed(1)}% Sup.</div>
                          <div className="w-24 h-1.5 bg-white/10 rounded-full mt-2 overflow-hidden">
                             <div className="h-full bg-orange-500" style={{ width: `${pair.support * 200}%` }} />
                          </div>
                        </div>
                      </div>
                    ))}
                    {(!data?.vizdata.pairs || data.vizdata.pairs.length === 0) && (
                      <div className="col-span-2 py-20 text-center opacity-30 italic font-black">No frequent pairs survive at this threshold. Try lowering Minimum Support.</div>
                    )}
                  </motion.div>
                )}

                {discoveryStep === 'rules' && (
                  <motion.div key="rules" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="grid gap-6 lg:grid-cols-2">
                    {data?.vizdata.rules.map((rule, i) => (
                      <div key={rule.id} className="p-8 rounded-[3rem] glass-card border-2 border-orange-500/20 bg-orange-500/5 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-all scale-150"><Icons.Shield size={60} /></div>
                        <div className="flex items-center gap-6 mb-8">
                           <div className="flex items-center gap-4">
                              <div className="w-14 h-14 rounded-2xl bg-black flex items-center justify-center text-3xl border border-white/10">{data.vizdata.items.find(it => it.name === rule.antecedent)?.emoji}</div>
                              <Icons.ArrowRight className="text-orange-500 animate-pulse" />
                              <div className="w-14 h-14 rounded-2xl bg-black flex items-center justify-center text-3xl border border-white/10">{data.vizdata.items.find(it => it.name === rule.consequent)?.emoji}</div>
                           </div>
                           <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase border ${rule.strength === 'strong' ? 'bg-green-500/20 border-green-500 text-green-500' : 'bg-orange-500/20 border-orange-500 text-orange-500'}`}>
                             {rule.strength} Evidence
                           </span>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                           <div className="p-4 rounded-2xl bg-black/40 border border-white/5">
                             <div className="text-[10px] font-black uppercase opacity-40 mb-1">Confidence</div>
                             <div className="text-xl font-black text-orange-500">{(rule.confidence * 100).toFixed(0)}%</div>
                           </div>
                           <div className="p-4 rounded-2xl bg-black/40 border border-white/5">
                             <div className="text-[10px] font-black uppercase opacity-40 mb-1">Lift Value</div>
                             <div className="text-xl font-black text-emerald-500">{rule.lift.toFixed(2)}</div>
                           </div>
                           <div className="p-4 rounded-2xl bg-black/40 border border-white/5">
                             <div className="text-[10px] font-black uppercase opacity-40 mb-1">Support</div>
                             <div className="text-xl font-black">{(rule.support * 100).toFixed(0)}%</div>
                           </div>
                        </div>
                      </div>
                    ))}
                    {(!data?.vizdata.rules || data.vizdata.rules.length === 0) && (
                      <div className="col-span-2 py-20 text-center opacity-30 italic font-black">Zero valid rules generated. The logic is sound, but the evidence is sparse. Increase Confidence!</div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex justify-center pt-10">
              <button onClick={() => setPhase('dashboard')} className="px-16 py-5 bg-orange-500 text-white rounded-[2rem] font-black shadow-2xl hover:bg-orange-600 transition-all">
                Finalize Master Report
              </button>
            </div>
          </motion.div>
        );

      case 'dashboard':
        return (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-12 py-10">
            <div className="flex flex-col md:flex-row gap-8 items-start justify-between">
              <div>
                <h2 className="text-5xl font-black tracking-tighter">Detective's <span className="text-orange-500">Audit</span></h2>
                <p className="opacity-60 text-lg mt-2">Comprehensive mapping of associations found in <strong>{currentParams.dataset}</strong>.</p>
              </div>
              <div className="flex gap-4">
                 <div className="p-8 rounded-[3rem] glass-card border border-white/10 text-center min-w-[160px]">
                    <div className="text-4xl font-black text-orange-500">{data?.metrics.nrules}</div>
                    <div className="text-[10px] font-black uppercase opacity-40 mt-2">Validated Rules</div>
                 </div>
                 <div className="p-8 rounded-[3rem] glass-card border border-white/10 text-center min-w-[160px]">
                    <div className="text-4xl font-black text-emerald-500">{data?.metrics.maxlift.toFixed(2)}x</div>
                    <div className="text-[10px] font-black uppercase opacity-40 mt-2">Highest Lift</div>
                 </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
               <div className="p-10 rounded-[4rem] glass-card border border-orange-500/20 bg-orange-500/5 space-y-8">
                  <h3 className="font-black text-2xl flex items-center gap-3"><Icons.Lightbulb className="text-orange-500" /> Business Intelligence</h3>
                  <div className="space-y-6">
                    <div className="p-6 rounded-3xl bg-black/40 border border-white/5">
                      <h4 className="font-black text-xs uppercase opacity-40 mb-2">Item Placement Strategy</h4>
                      <p className="text-sm leading-relaxed opacity-80">Based on rules with lift > 1.2, we recommend placing <strong>{data?.vizdata.rules[0]?.antecedent}</strong> near <strong>{data?.vizdata.rules[0]?.consequent}</strong> to maximize cross-sell potential.</p>
                    </div>
                    <div className="p-6 rounded-3xl bg-black/40 border border-white/5">
                      <h4 className="font-black text-xs uppercase opacity-40 mb-2">Rule Density Audit</h4>
                      <p className="text-sm leading-relaxed opacity-80">Average Confidence for this run is <strong>{(data?.metrics.avgconfidence || 0 * 100).toFixed(1)}%</strong>. This indicates a moderately strong pattern network in the source transactions.</p>
                    </div>
                  </div>
               </div>
               <div className="rounded-[4rem] glass-card border border-white/10 overflow-hidden flex flex-col">
                  <div className="p-8 border-b border-white/10 flex items-center justify-between">
                    <h4 className="font-black text-lg">Registry of Discovered Rules</h4>
                  </div>
                  <div className="flex-grow overflow-y-auto max-h-[350px] custom-scrollbar">
                    <table className="w-full text-left text-xs">
                      <thead className="sticky top-0 bg-black/80 backdrop-blur-md z-10">
                        <tr className="opacity-40 uppercase font-black tracking-widest border-b border-white/5">
                          <th className="p-6">Direction</th>
                          <th className="p-6 text-center">Conf %</th>
                          <th className="p-6 text-center">Lift</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {data?.vizdata.rules.map(r => (
                          <tr key={r.id} className="hover:bg-white/5 transition-colors">
                            <td className="p-6 font-bold flex items-center gap-3">
                              {r.antecedent} <Icons.ArrowRight size={10} className="text-orange-500" /> {r.consequent}
                            </td>
                            <td className="p-6 text-center font-black text-orange-500">{(r.confidence * 100).toFixed(0)}%</td>
                            <td className="p-6 text-center font-black text-emerald-500">{r.lift.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
               </div>
            </div>

            <div className="flex justify-center gap-6">
              <button onClick={() => setPhase('setup')} className="px-12 py-4 rounded-[2rem] border-2 border-white/10 font-black hover:bg-white/5 transition-all">Restart Experiment</button>
              <button onClick={() => setPhase('network')} className="px-16 py-4 bg-white text-black rounded-[2rem] font-black shadow-2xl hover:bg-orange-500 hover:text-white transition-all flex items-center gap-3">
                Visualize Crime Network <Icons.Share2 />
              </button>
            </div>
          </motion.div>
        );

      case 'network':
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-[650px] w-full flex flex-col gap-6 py-6">
            <div className="flex justify-between items-center px-4">
              <div>
                <h2 className="text-3xl font-black">Rule Gravity Network</h2>
                <p className="opacity-40 text-sm">3D Force-Directed Graph of Association Dynamics</p>
              </div>
              <button onClick={() => setPhase('dashboard')} className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-orange-500"><Icons.LayoutGrid size={24}/></button>
            </div>
            <div className="flex-grow relative rounded-[4rem] overflow-hidden border border-white/10 glass-card bg-black/40 shadow-inner">
               <div className="absolute top-8 left-8 z-10 pointer-events-none flex flex-col gap-2">
                 <div className="flex gap-2">
                    <span className="px-3 py-1 bg-orange-500 text-white text-[10px] font-black uppercase rounded-full">Nodes: Support</span>
                    <span className="px-3 py-1 bg-green-500 text-white text-[10px] font-black uppercase rounded-full">Edges: Confidence</span>
                 </div>
                 <p className="text-[10px] font-bold opacity-30 uppercase tracking-widest bg-black/20 p-2 rounded-xl backdrop-blur-md">Rotate: Click+Drag | Zoom: Scroll | Pan: Right-Click</p>
               </div>
               <div ref={mountRef} className="w-full h-full cursor-move" />
            </div>
          </motion.div>
        );
    }
  };

  return (
    <div className="space-y-12">
      {/* Gamified Phase Navigation */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-8 rounded-[3rem] glass-card border border-white/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-orange-500/5 pointer-events-none" />
        <div className="flex items-center gap-6 overflow-x-auto pb-4 md:pb-0 scrollbar-hide relative z-10">
          {phases.map((p, i) => {
            const isActive = phase === p.id;
            const isCompleted = phases.findIndex(x => x.id === phase) > i;
            return (
              <div key={p.id} className="flex items-center gap-6 shrink-0">
                <button 
                  onClick={() => setPhase(p.id as Phase)}
                  className={`flex flex-col items-center gap-2 group transition-all ${isActive ? 'opacity-100' : isCompleted ? 'opacity-60' : 'opacity-20'}`}
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all ${
                    isActive ? 'bg-orange-500 border-orange-500 text-white shadow-xl shadow-orange-500/20' : 
                    isCompleted ? 'bg-white/10 border-orange-500 text-orange-500' : 'bg-white/5 border-white/10 text-white'
                  }`}>
                    {isCompleted ? <Icons.Check size={20} /> : <p.icon size={24} />}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest">{p.label}</span>
                </button>
                {i < phases.length - 1 && <Icons.ChevronRight className="opacity-10" size={16} />}
              </div>
            );
          })}
        </div>

        <div className="flex items-center gap-6 border-l border-white/10 pl-8 relative z-10">
           <div className="text-right">
              <div className="text-[10px] uppercase font-black opacity-30 tracking-[0.2em] mb-1">Detective XP</div>
              <motion.div key={xp} initial={{ scale: 1.2, color: '#ff7e06' }} animate={{ scale: 1, color: '#fff' }} className="text-3xl font-black tabular-nums">{xp}</motion.div>
           </div>
           <div className="w-16 h-16 rounded-3xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500 shadow-inner">
              <Icons.ShieldAlert size={32} className="animate-pulse" />
           </div>
        </div>
      </div>

      {/* Main Investigation Area */}
      <div className="min-h-[500px]">
        {isLoading ? (
          <div className="h-[500px] flex flex-col items-center justify-center gap-6">
            <div className="w-16 h-16 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin"></div>
            <p className="text-orange-500 font-black animate-pulse uppercase tracking-[0.4em] text-xs">Simulating Transactions...</p>
          </div>
        ) : renderPhaseContent()}
      </div>

      {/* Achievement Alert */}
      <AnimatePresence>
        {activeAchievement && (
          <motion.div 
            initial={{ x: 300, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 300, opacity: 0 }}
            className="fixed bottom-10 right-10 z-[100] p-8 rounded-[3rem] bg-orange-500 text-white shadow-2xl flex items-center gap-6 border-4 border-white/20"
          >
            <div className="w-20 h-20 rounded-3xl bg-white/20 flex items-center justify-center shadow-inner"><Icons.Trophy size={40} /></div>
            <div>
               <h4 className="font-black text-xs uppercase tracking-widest opacity-60">Achievement Unlocked</h4>
               <p className="text-2xl font-black">{activeAchievement}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AprioriVisualization;
