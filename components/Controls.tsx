import React, { useState } from 'react';
import { ViewType, GraphNodeData, LayoutConfig } from '../types';
import { Loader2, Sparkles, RefreshCw, AlertCircle, Layers } from 'lucide-react';

interface ControlsProps {
  config: LayoutConfig;
  onConfigChange: (c: LayoutConfig) => void;
  viewType: ViewType;
  onViewTypeChange: (v: ViewType) => void;
  onGenerate: (prompt: string) => Promise<void>;
  isGenerating: boolean;
  onDataChange: (data: GraphNodeData[]) => void;
  currentData: GraphNodeData[];
  showLayers: boolean;
  onShowLayersChange: (s: boolean) => void;
}

export const Controls: React.FC<ControlsProps> = ({
  config,
  onConfigChange,
  viewType,
  onViewTypeChange,
  onGenerate,
  isGenerating,
  onDataChange,
  currentData,
  showLayers,
  onShowLayersChange
}) => {
  const [prompt, setPrompt] = useState('');
  const [jsonInput, setJsonInput] = useState(JSON.stringify(currentData, null, 2));
  const [tab, setTab] = useState<'visual' | 'data'>('visual');
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    onGenerate(prompt).then(() => {
        setTab('visual');
    }).catch(() => {
        // Error handled in App
    });
  };

  const handleJsonUpdate = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setJsonInput(val);
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) {
        onDataChange(parsed);
        setError(null);
      }
    } catch (err) {
      setError("Invalid JSON");
    }
  };

  // Sync local JSON state if parent data changes externally (e.g. AI generation)
  React.useEffect(() => {
    setJsonInput(JSON.stringify(currentData, null, 2));
  }, [currentData]);

  return (
    <div className="w-80 bg-slate-50 border-r border-slate-200 flex flex-col h-full shadow-xl z-20">
      <div className="p-4 border-b border-slate-200 bg-white">
        <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <svg className="w-6 h-6 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="6" cy="6" r="3" />
                <circle cx="6" cy="18" r="3" />
                <line x1="20" y1="4" x2="8.12" y2="15.88" />
                <line x1="14.47" y1="14.48" x2="20" y2="20" />
                <path d="M8.12 8.12L12 12" />
            </svg>
            DagViz
        </h1>
        <p className="text-xs text-slate-500 mt-1">Sugiyama Layout Visualizer</p>
      </div>

      <div className="flex border-b border-slate-200">
        <button 
            className={`flex-1 py-3 text-sm font-medium ${tab === 'visual' ? 'bg-white text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500 hover:bg-slate-100'}`}
            onClick={() => setTab('visual')}
        >
            Visuals
        </button>
        <button 
            className={`flex-1 py-3 text-sm font-medium ${tab === 'data' ? 'bg-white text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500 hover:bg-slate-100'}`}
            onClick={() => setTab('data')}
        >
            Data & AI
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        
        {tab === 'visual' && (
            <>
                <section>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Node Style</h3>
                    <div className="grid grid-cols-3 gap-2">
                        {Object.values(ViewType).map((type) => (
                            <button
                                key={type}
                                onClick={() => onViewTypeChange(type)}
                                className={`px-2 py-2 text-xs rounded border transition-all ${
                                    viewType === type 
                                    ? 'bg-indigo-50 border-indigo-500 text-indigo-700 font-semibold ring-1 ring-indigo-200' 
                                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                                }`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </section>

                <section>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Debug & Learn</h3>
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={() => onShowLayersChange(!showLayers)}
                            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded border text-sm transition-colors ${
                                showLayers 
                                ? 'bg-indigo-100 border-indigo-400 text-indigo-800' 
                                : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-50'
                            }`}
                        >
                            <Layers className="w-4 h-4" />
                            {showLayers ? 'Hide Layers' : 'Show Layers'}
                        </button>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-2 leading-tight">
                        Toggle "Show Layers" to see the specific "Rank" assigned to each node by the layout algorithm.
                    </p>
                </section>

                <section>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Layout Dimensions</h3>
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between text-xs text-slate-600 mb-1">
                                <span>Node Width</span>
                                <span>{config.nodeWidth}px</span>
                            </div>
                            <input 
                                type="range" min="50" max="300" step="10" 
                                value={config.nodeWidth}
                                onChange={(e) => onConfigChange({...config, nodeWidth: Number(e.target.value)})}
                                className="w-full accent-indigo-600"
                            />
                        </div>
                        <div>
                            <div className="flex justify-between text-xs text-slate-600 mb-1">
                                <span>Node Height</span>
                                <span>{config.nodeHeight}px</span>
                            </div>
                            <input 
                                type="range" min="30" max="200" step="10" 
                                value={config.nodeHeight}
                                onChange={(e) => onConfigChange({...config, nodeHeight: Number(e.target.value)})}
                                className="w-full accent-indigo-600"
                            />
                        </div>
                        <div>
                            <div className="flex justify-between text-xs text-slate-600 mb-1">
                                <span>Vertical Spacing</span>
                                <span>{config.rankSep}px</span>
                            </div>
                            <input 
                                type="range" min="10" max="200" step="10" 
                                value={config.rankSep}
                                onChange={(e) => onConfigChange({...config, rankSep: Number(e.target.value)})}
                                className="w-full accent-indigo-600"
                            />
                        </div>
                         <div>
                            <div className="flex justify-between text-xs text-slate-600 mb-1">
                                <span>Horizontal Spacing</span>
                                <span>{config.nodeSep}px</span>
                            </div>
                            <input 
                                type="range" min="10" max="150" step="10" 
                                value={config.nodeSep}
                                onChange={(e) => onConfigChange({...config, nodeSep: Number(e.target.value)})}
                                className="w-full accent-indigo-600"
                            />
                        </div>
                    </div>
                </section>
            </>
        )}

        {tab === 'data' && (
            <>
                <section>
                    <h3 className="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-3 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> AI Generation
                    </h3>
                    <div className="space-y-2">
                        <textarea 
                            className="w-full p-3 text-sm border border-slate-200 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent min-h-[80px]"
                            placeholder="E.g., 'Software Development Lifecycle steps' or 'Family tree of Greek Gods'"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                        />
                        <button
                            onClick={handleGenerate}
                            disabled={isGenerating || !prompt}
                            className="w-full flex items-center justify-center py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
                            Generate Graph
                        </button>
                    </div>
                </section>

                <hr className="border-slate-100" />

                <section className="flex-1 flex flex-col">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex justify-between items-center">
                        <span>JSON Data</span>
                        {error && <span className="text-rose-500 flex items-center gap-1 normal-case"><AlertCircle className="w-3 h-3"/> Invalid JSON</span>}
                    </h3>
                    <textarea 
                        className={`w-full flex-1 p-3 text-xs font-mono border rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent h-64 ${error ? 'border-rose-300 bg-rose-50' : 'border-slate-200'}`}
                        value={jsonInput}
                        onChange={handleJsonUpdate}
                        spellCheck={false}
                    />
                    <p className="text-[10px] text-slate-400 mt-2">
                        Format: Array of objects with <code>id</code> (string) and <code>parentIds</code> (string[]).
                    </p>
                </section>
            </>
        )}
      </div>
    </div>
  );
};