import React from 'react';
import { ViewType, LayoutConfig } from '../types';
import { Layers } from 'lucide-react';

interface ControlsVisualsProps {
  config: LayoutConfig;
  onConfigChange: (c: LayoutConfig) => void;
  viewType: ViewType;
  onViewTypeChange: (v: ViewType) => void;
  showLayers: boolean;
  onShowLayersChange: (s: boolean) => void;
}

export const ControlsVisuals: React.FC<ControlsVisualsProps> = ({
  config,
  onConfigChange,
  viewType,
  onViewTypeChange,
  showLayers,
  onShowLayersChange
}) => {
  return (
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
  );
};