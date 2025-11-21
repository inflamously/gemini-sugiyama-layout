import React, { useState } from 'react';
import { ViewType, GraphNodeData, LayoutConfig } from '../types';
import { ControlsHeader } from './ControlsHeader';
import { ControlsVisuals } from './ControlsVisuals';
import { ControlsData } from './ControlsData';

interface ControlsProps {
  config: LayoutConfig;
  onConfigChange: (c: LayoutConfig) => void;
  viewType: ViewType;
  onViewTypeChange: (v: ViewType) => void;
  onDataChange: (data: GraphNodeData[]) => void;
  currentData: GraphNodeData[];
  showLayers: boolean;
  onShowLayersChange: (s: boolean) => void;
}

export const Controls: React.FC<ControlsProps> = (props) => {
  const [tab, setTab] = useState<'visual' | 'data'>('visual');

  return (
    <div className="w-80 bg-slate-50 border-r border-slate-200 flex flex-col h-full shadow-xl z-20">
      <ControlsHeader />

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
            Data
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {tab === 'visual' && (
            <ControlsVisuals 
                config={props.config}
                onConfigChange={props.onConfigChange}
                viewType={props.viewType}
                onViewTypeChange={props.onViewTypeChange}
                showLayers={props.showLayers}
                onShowLayersChange={props.onShowLayersChange}
            />
        )}

        {tab === 'data' && (
            <ControlsData 
                currentData={props.currentData}
                onDataChange={props.onDataChange}
            />
        )}
      </div>
    </div>
  );
};