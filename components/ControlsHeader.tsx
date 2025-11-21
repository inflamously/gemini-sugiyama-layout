import React from 'react';

export const ControlsHeader: React.FC = () => (
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
);