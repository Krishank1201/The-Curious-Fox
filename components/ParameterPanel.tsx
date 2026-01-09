
import React from 'react';
import * as Icons from 'lucide-react';

interface ParameterPanelProps {
  params: { dataset: string; k: number; maxiter: number };
  setParams: (p: any) => void;
  onRun: () => void;
  isLoading: boolean;
}

const ParameterPanel: React.FC<ParameterPanelProps> = ({ params, setParams, onRun, isLoading }) => {
  return (
    <div className="grid md:grid-cols-4 gap-4 p-6 rounded-3xl bg-orange-500/5 border border-orange-500/10">
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase opacity-50 px-1">Dataset Type</label>
        <select 
          value={params.dataset}
          onChange={(e) => setParams({ ...params, dataset: e.target.value })}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 outline-none focus:border-orange-500 text-sm font-bold text-white bg-black"
        >
          <option value="blobs">Clustered Blobs</option>
          <option value="random">Pure Random</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase opacity-50 px-1">Number of Clusters (K): {params.k}</label>
        <input 
          type="range" min="1" max="7" step="1"
          value={params.k}
          onChange={(e) => setParams({ ...params, k: parseInt(e.target.value) })}
          className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-orange-500"
        />
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase opacity-50 px-1">Max Iterations: {params.maxiter}</label>
        <input 
          type="range" min="10" max="300" step="10"
          value={params.maxiter}
          onChange={(e) => setParams({ ...params, maxiter: parseInt(e.target.value) })}
          className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-orange-500"
        />
      </div>

      <div className="flex items-end">
        <button 
          onClick={onRun}
          disabled={isLoading}
          className="w-full py-2 bg-orange-500 text-white rounded-xl font-black shadow-lg hover:bg-orange-600 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isLoading ? <Icons.Loader className="animate-spin" size={18} /> : <Icons.Zap size={18} />}
          Run K-Means
        </button>
      </div>
    </div>
  );
};

export default ParameterPanel;
