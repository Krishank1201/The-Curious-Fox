
import React, { useState, useEffect, useRef, useMemo } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';
import { PCAResult } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

interface PCAVisualizationProps {
  data: PCAResult | null;
  isLoading: boolean;
  isDarkMode: boolean;
}

type Phase = 'space' | 'variance' | 'emergence' | 'reduction' | 'insight';

const PCAVisualization: React.FC<PCAVisualizationProps> = ({ data, isLoading, isDarkMode }) => {
  const [phase, setPhase] = useState<Phase>('space');
  const [xp, setXP] = useState(0);
  const [badges, setBadges] = useState<string[]>([]);
  const [activeBadge, setActiveBadge] = useState<string | null>(null);
  const [k, setK] = useState(3);
  const mountRef = useRef<HTMLDivElement>(null);

  // Phases Meta
  const phases = [
    { id: 'space', label: 'Scatter Universe', icon: Icons.Wind },
    { id: 'variance', label: 'Energy Flow', icon: Icons.Zap },
    { id: 'emergence', label: 'Component Lab', icon: Icons.Compass },
    { id: 'reduction', label: 'Projection Gate', icon: Icons.Shrink },
    { id: 'insight', label: 'Insight Hub', icon: Icons.BarChart3 },
  ];

  const addXP = (amount: number, badge?: string) => {
    setXP(prev => prev + amount);
    if (badge && !badges.includes(badge)) {
      setBadges(prev => [...prev, badge]);
      setActiveBadge(badge);
      setTimeout(() => setActiveBadge(null), 3000);
    }
  };

  useEffect(() => {
    if (phase === 'variance') addXP(150, 'Variance Seeker');
    if (phase === 'emergence') addXP(200, 'Dimension Tamer');
    if (phase === 'reduction') addXP(300, 'PCA Navigator');
  }, [phase]);

  // Three.js Scene Management
  useEffect(() => {
    if (!mountRef.current || !data) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(isDarkMode ? 0x000000 : 0xf8fafc);
    
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(15, 15, 15);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    mountRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xff7e06, 1);
    pointLight.position.set(10, 20, 10);
    scene.add(pointLight);

    // Helpers
    const axesHelper = new THREE.AxesHelper(10);
    scene.add(axesHelper);

    // Grid
    const grid = new THREE.GridHelper(20, 20, 0x444444, 0x222222);
    scene.add(grid);

    // Points
    const pointsGroup = new THREE.Group();
    const pointGeo = new THREE.SphereGeometry(0.15, 12, 12);
    const pointMat = new THREE.MeshPhongMaterial({ 
      color: 0xff7e06, 
      emissive: 0xff7e06, 
      emissiveIntensity: 0.2 
    });

    data.points.forEach((p) => {
      const mesh = new THREE.Mesh(pointGeo, pointMat);
      mesh.position.set(p[0], p[1], p[2]);
      pointsGroup.add(mesh);
    });
    scene.add(pointsGroup);

    // PC Vectors (Arrows)
    const pcGroup = new THREE.Group();
    if (phase === 'emergence' || phase === 'reduction') {
      const colors = [0xff7e06, 0x22c55e, 0x3b82f6];
      data.components.forEach((comp, i) => {
        const dir = new THREE.Vector3(comp[0], comp[1], comp[2]);
        const origin = new THREE.Vector3(0, 0, 0);
        const length = 8 * data.explained_variance[i];
        const arrow = new THREE.ArrowHelper(dir, origin, length, colors[i], 0.8, 0.4);
        pcGroup.add(arrow);
      });
      scene.add(pcGroup);
    }

    // Variance Ellipsoid
    let ellipsoid: THREE.Mesh | null = null;
    if (phase === 'variance') {
      const eGeo = new THREE.SphereGeometry(1, 32, 32);
      const eMat = new THREE.MeshBasicMaterial({ 
        color: 0xff7e06, 
        transparent: true, 
        opacity: 0.1, 
        wireframe: true 
      });
      ellipsoid = new THREE.Mesh(eGeo, eMat);
      // Scale based on variance
      ellipsoid.scale.set(10, 4, 2);
      ellipsoid.rotation.z = Math.PI / 6;
      scene.add(ellipsoid);
    }

    // Projection Visualization
    if (phase === 'reduction') {
      // Logic to move points to PC plane or line
      pointsGroup.children.forEach((mesh, i) => {
        const p = data.points[i];
        const target = new THREE.Vector3();
        if (k === 1) {
          // Project to PC1 line
          const val = data.projections.pc1[i];
          const pc1 = data.components[0];
          target.set(val * pc1[0], val * pc1[1], val * pc1[2]);
        } else if (k === 2) {
          // Project to PC1-PC2 plane
          const v1 = data.projections.pc1[i];
          const v2 = data.projections.pc2[i];
          const pc1 = data.components[0];
          const pc2 = data.components[1];
          target.set(
            v1 * pc1[0] + v2 * pc2[0],
            v1 * pc1[1] + v2 * pc2[1],
            v1 * pc1[2] + v2 * pc2[2]
          );
        } else {
          target.set(p[0], p[1], p[2]);
        }
        mesh.position.lerp(target, 0.05);
      });
    }

    let frame: number;
    const animate = () => {
      frame = requestAnimationFrame(animate);
      controls.update();
      if (ellipsoid) {
        ellipsoid.material.opacity = 0.1 + Math.sin(Date.now() * 0.002) * 0.05;
      }
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', handleResize);
      if (mountRef.current) mountRef.current.innerHTML = '';
      renderer.dispose();
    };
  }, [data, phase, isDarkMode, k]);

  const renderPhaseContent = () => {
    switch (phase) {
      case 'space':
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="flex items-center gap-4 text-orange-500">
               <Icons.Wind size={40} />
               <h2 className="text-4xl font-black italic">Scatter Universe</h2>
            </div>
            <p className="text-lg opacity-60 max-w-xl">
              Dr. Fox: "Look at these data points—each a star in our multidimensional sky. Currently, we view them through raw features. Can you see any hidden structure?"
            </p>
            <div className="flex gap-4">
               <button onClick={() => setPhase('variance')} className="px-10 py-4 bg-orange-500 text-white rounded-2xl font-black shadow-xl hover:bg-orange-600 transition-all flex items-center gap-2">
                 Discover Variance <Icons.ArrowRight />
               </button>
            </div>
          </motion.div>
        );

      case 'variance':
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="flex items-center gap-4 text-orange-500">
               <Icons.Zap size={40} />
               <h2 className="text-4xl font-black italic">Energy Flow Field</h2>
            </div>
            <p className="text-lg opacity-60 max-w-xl">
              "Variance is information. The direction with the most spread is where the most 'story' happens. Notice the glowing field—it highlights our primary axis of truth."
            </p>
            <div className="p-6 rounded-2xl bg-orange-500/10 border border-orange-500/20 max-w-sm">
               <h4 className="font-black text-xs uppercase tracking-widest mb-2">Detective Insight</h4>
               <p className="text-sm opacity-80 italic">"The long axis of the ellipse contains 72% of the total variance."</p>
            </div>
            <div className="flex gap-4">
               <button onClick={() => setPhase('emergence')} className="px-10 py-4 bg-orange-500 text-white rounded-2xl font-black shadow-xl hover:bg-orange-600 transition-all flex items-center gap-2">
                 Find Components <Icons.ArrowRight />
               </button>
            </div>
          </motion.div>
        );

      case 'emergence':
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="flex items-center gap-4 text-orange-500">
               <Icons.Compass size={40} />
               <h2 className="text-4xl font-black italic">Rotating Axes Lab</h2>
            </div>
            <p className="text-lg opacity-60 max-w-xl">
              "PCA rotates the entire universe. It aligns our new axes (Principal Components) with the maximum spread of data. The orange arrow is PC1—your most important feature."
            </p>
            <div className="flex gap-4">
               <button onClick={() => setPhase('reduction')} className="px-10 py-4 bg-orange-500 text-white rounded-2xl font-black shadow-xl hover:bg-orange-600 transition-all flex items-center gap-2">
                 Project Data <Icons.ArrowRight />
               </button>
            </div>
          </motion.div>
        );

      case 'reduction':
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="flex items-center gap-4 text-orange-500">
               <Icons.Shrink size={40} />
               <h2 className="text-4xl font-black italic">Projection Gate</h2>
            </div>
            <p className="text-lg opacity-60 max-w-xl">
              "Now, we simplify. By collapsing dimensions, we lose some noise but keep the core signal. Watch as the stars cast their shadows onto the PC planes."
            </p>
            <div className="space-y-4">
               <label className="block text-[10px] font-black uppercase opacity-40 tracking-widest">Select Target Dimensions (k)</label>
               <div className="flex gap-2">
                 {[1, 2, 3].map(val => (
                   <button 
                    key={val} 
                    onClick={() => setK(val)}
                    className={`px-8 py-3 rounded-xl font-black transition-all ${k === val ? 'bg-orange-500 text-white' : 'bg-white/5 border border-white/10 opacity-40 hover:opacity-100'}`}
                   >
                     {val}D
                   </button>
                 ))}
               </div>
            </div>
            <button onClick={() => setPhase('insight')} className="px-10 py-4 bg-orange-500 text-white rounded-2xl font-black shadow-xl hover:bg-orange-600 transition-all flex items-center gap-2">
               Analyze Mastery <Icons.ArrowRight />
            </button>
          </motion.div>
        );

      case 'insight':
        return (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-10">
            <div className="flex items-center gap-4 text-orange-500">
               <Icons.BarChart3 size={40} />
               <h2 className="text-4xl font-black italic">Insight Hub</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase opacity-40 tracking-widest">Variance Retention (Scree Plot)</h4>
                  <div className="h-64 bg-black/20 rounded-3xl border border-white/10 p-4">
                    <ResponsiveContainer width="100%" height="100%">
                       <BarChart data={data?.explained_variance.map((v, i) => ({ name: `PC${i+1}`, val: v * 100 }))}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                          <XAxis dataKey="name" stroke="#666" />
                          <YAxis stroke="#666" />
                          <Tooltip contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '12px' }} />
                          <Bar dataKey="val" fill="#FF7E06" radius={[4, 4, 0, 0]} />
                       </BarChart>
                    </ResponsiveContainer>
                  </div>
               </div>

               <div className="p-8 rounded-[3rem] glass-card border border-orange-500/20 bg-orange-500/5 space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-black">Audit Report</h3>
                    <Icons.ShieldCheck className="text-orange-500" />
                  </div>
                  <ul className="space-y-4">
                    <li className="flex gap-3 text-sm font-medium">
                      <Icons.CheckCircle2 className="text-green-500 shrink-0" size={18} />
                      <span>PC1 captures <strong>72%</strong> of total data variance.</span>
                    </li>
                    <li className="flex gap-3 text-sm font-medium">
                      <Icons.CheckCircle2 className="text-green-500 shrink-0" size={18} />
                      <span>Using 2 components retains <strong>93%</strong> of total info.</span>
                    </li>
                    <li className="flex gap-3 text-sm font-medium opacity-50 italic">
                      <Icons.Info className="shrink-0" size={18} />
                      <span>PCA is effective here due to high feature correlation.</span>
                    </li>
                  </ul>
                  <button onClick={() => setPhase('space')} className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 font-black hover:bg-orange-500 hover:text-white transition-all">Restart Explorer</button>
               </div>
            </div>
          </motion.div>
        );
    }
  };

  return (
    <div className="flex flex-col gap-8 h-full">
      {/* Gamified HUD */}
      <div className="p-6 rounded-[3rem] glass-card border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
         <div className="flex items-center gap-6 overflow-x-auto pb-4 md:pb-0 scrollbar-hide">
            {phases.map((p, i) => {
               const isActive = phase === p.id;
               const isDone = phases.findIndex(x => x.id === phase) > i;
               return (
                 <div key={p.id} className="flex items-center gap-4 shrink-0">
                    <button 
                      onClick={() => setPhase(p.id as Phase)}
                      className={`flex flex-col items-center gap-2 transition-all ${isActive ? 'scale-110' : 'opacity-40'}`}
                    >
                       <div className={`w-12 h-12 rounded-xl flex items-center justify-center border-2 transition-all ${isActive ? 'bg-orange-500 border-orange-500 text-white' : isDone ? 'bg-white/10 border-orange-500 text-orange-500' : 'bg-white/5 border-white/10 text-white'}`}>
                          {isDone ? <Icons.Check size={20}/> : <p.icon size={20} />}
                       </div>
                       <span className="text-[8px] font-black uppercase tracking-widest">{p.label}</span>
                    </button>
                    {i < phases.length - 1 && <Icons.ChevronRight className="opacity-10" />}
                 </div>
               );
            })}
         </div>

         <div className="flex items-center gap-6 border-l border-white/10 pl-8">
            <div className="text-right">
               <div className="text-[8px] font-black uppercase opacity-40">Navigator XP</div>
               <div className="text-2xl font-black text-orange-500">{xp}</div>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500">
               <Icons.BrainCircuit size={28} className="animate-pulse" />
            </div>
         </div>
      </div>

      {/* Main Experience Area */}
      <div className="flex-grow grid lg:grid-cols-12 gap-8 min-h-[600px]">
        {/* Three.js Visualizer */}
        <div className="lg:col-span-8 relative rounded-[4rem] overflow-hidden border border-white/10 glass-card bg-black shadow-inner">
           {isLoading ? (
             <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                <div className="w-12 h-12 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin"></div>
                <p className="text-orange-500 font-black animate-pulse text-xs uppercase tracking-widest">Simulating Dimensions...</p>
             </div>
           ) : (
             <>
               <div className="absolute top-8 left-8 z-10 pointer-events-none flex flex-col gap-2">
                 <div className="flex gap-2">
                    <span className="px-3 py-1 bg-orange-500 text-white text-[9px] font-black uppercase rounded-full">3D SPACE</span>
                    <span className="px-3 py-1 bg-white/10 text-white/40 text-[9px] font-bold rounded-full backdrop-blur-md">Rotate: Click+Drag | Zoom: Scroll</span>
                 </div>
               </div>
               <div ref={mountRef} className="w-full h-full cursor-move" />
             </>
           )}
        </div>

        {/* Info & Navigation */}
        <div className="lg:col-span-4 flex flex-col">
           <div className="flex-grow">
             <AnimatePresence mode="wait">
               {renderPhaseContent()}
             </AnimatePresence>
           </div>
        </div>
      </div>

      {/* Badge Unlock */}
      <AnimatePresence>
        {activeBadge && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] p-6 rounded-[2.5rem] bg-orange-500 text-white shadow-2xl flex items-center gap-4 border-4 border-white/20"
          >
             <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center"><Icons.Trophy size={32} /></div>
             <div>
                <h4 className="text-[10px] font-black uppercase opacity-60">Achievement Unlocked</h4>
                <p className="text-xl font-black">{activeBadge}</p>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PCAVisualization;
