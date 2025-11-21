import React, { useState, useEffect, useMemo } from 'react';
import { GraphCanvas } from './components/GraphCanvas';
import { Controls } from './components/Controls';
import { calculateLayout } from './services/layoutService';
import { generateGraphData } from './services/geminiService';
import { GraphNodeData, LayoutConfig, ViewType, LayoutResult } from './types';
import { AlertTriangle } from 'lucide-react';

// Initial Data
const INITIAL_DATA: GraphNodeData[] = [
  { id: 'Start', parentIds: [], label: 'Initialization', type: 'process', details: 'Boot system' },
  { id: 'Load Config', parentIds: ['Start'], label: 'Load Config', type: 'process', details: 'Read env vars' },
  { id: 'Validate', parentIds: ['Load Config'], label: 'Validation', type: 'decision', details: 'Check schema' },
  { id: 'Error', parentIds: ['Validate'], label: 'Error Handler', type: 'process', details: 'Log failure' },
  { id: 'Connect DB', parentIds: ['Validate'], label: 'Connect DB', type: 'process', details: 'Pool connection' },
  { id: 'Fetch Data', parentIds: ['Connect DB'], label: 'Fetch Data', type: 'process', details: 'Query rows' },
  { id: 'Process', parentIds: ['Fetch Data'], label: 'Transform', type: 'process', details: 'Map/Reduce' },
  { id: 'Save', parentIds: ['Process'], label: 'Save Result', type: 'output', details: 'Write to disk' },
  { id: 'Cleanup', parentIds: ['Save', 'Error'], label: 'Cleanup', type: 'process', details: 'Close handles' },
  { id: 'End', parentIds: ['Cleanup'], label: 'Termination', type: 'output', details: 'Exit 0' }
];

const INITIAL_CONFIG: LayoutConfig = {
  nodeWidth: 120,
  nodeHeight: 60,
  rankSep: 70,
  nodeSep: 50,
};

const App: React.FC = () => {
  const [data, setData] = useState<GraphNodeData[]>(INITIAL_DATA);
  const [config, setConfig] = useState<LayoutConfig>(INITIAL_CONFIG);
  const [viewType, setViewType] = useState<ViewType>(ViewType.CARD);
  const [showLayers, setShowLayers] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Responsive defaults based on ViewType
  useEffect(() => {
    if (viewType === ViewType.SIMPLE) {
      setConfig(c => ({ ...c, nodeWidth: 100, nodeHeight: 40 }));
    } else if (viewType === ViewType.TECHNICAL) {
      setConfig(c => ({ ...c, nodeWidth: 160, nodeHeight: 80 }));
    } else {
      setConfig(c => ({ ...c, nodeWidth: 140, nodeHeight: 80 }));
    }
  }, [viewType]);

  const layout = useMemo<LayoutResult | null>(() => {
    try {
      setError(null);
      return calculateLayout(data, config);
    } catch (e) {
      setError("Layout calculation failed. Check for cyclical dependencies in data.");
      return null;
    }
  }, [data, config]);

  const handleGenerate = async (prompt: string) => {
    setIsGenerating(true);
    setError(null);
    try {
      const newData = await generateGraphData(prompt);
      if (newData.length > 0) {
        setData(newData);
      } else {
        setError("AI returned no data.");
      }
    } catch (e) {
      setError("Failed to generate graph. Please check API key configuration or try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex h-screen w-screen bg-slate-50 overflow-hidden">
      <Controls
        config={config}
        onConfigChange={setConfig}
        viewType={viewType}
        onViewTypeChange={setViewType}
        onGenerate={handleGenerate}
        isGenerating={isGenerating}
        onDataChange={setData}
        currentData={data}
        showLayers={showLayers}
        onShowLayersChange={setShowLayers}
      />
      
      <main className="flex-1 flex flex-col h-full relative">
        {/* Top Bar */}
        <div className="h-14 bg-white border-b border-slate-200 flex items-center px-6 justify-between shadow-sm z-10">
            <div className="flex items-center gap-4">
                 <span className="text-sm font-semibold text-slate-600">
                    {data.length} Nodes
                 </span>
                 <span className="text-slate-300">|</span>
                 <span className="text-sm font-semibold text-slate-600">
                    {layout?.width ? Math.round(layout.width) : 0} x {layout?.height ? Math.round(layout.height) : 0} Canvas
                 </span>
            </div>
            <div className="text-xs text-slate-400">
                Powered by Custom Layout & Gemini 2.5 Flash
            </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 relative overflow-hidden bg-slate-100/50 p-4">
            {error && (
                <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-rose-50 text-rose-600 border border-rose-200 px-4 py-3 rounded shadow-lg flex items-center gap-2 z-50 max-w-md">
                    <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                    <p className="text-sm">{error}</p>
                    <button onClick={() => setError(null)} className="ml-4 text-rose-400 hover:text-rose-700">&times;</button>
                </div>
            )}
            
            {layout ? (
                <GraphCanvas 
                    layout={layout} 
                    viewType={viewType}
                    nodeWidth={config.nodeWidth}
                    nodeHeight={config.nodeHeight}
                    showLayers={showLayers}
                />
            ) : (
                <div className="flex items-center justify-center h-full text-slate-400">
                    <p>No valid layout to display.</p>
                </div>
            )}
        </div>
      </main>
    </div>
  );
};

export default App;