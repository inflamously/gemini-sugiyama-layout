import React from 'react';
import { GraphNodeData } from '../types';

interface TechnicalNodeProps {
  data: GraphNodeData;
  width: number;
  height: number;
}

export const TechnicalNode: React.FC<TechnicalNodeProps> = ({ data, width, height }) => (
  <div 
    className="bg-slate-900 text-green-400 font-mono text-xs border border-slate-700 rounded shadow-lg p-2 relative overflow-hidden group"
    style={{ width, height }}
  >
    <div className="absolute top-0 left-0 w-full h-1 bg-green-500 opacity-50"></div>
    <div className="flex justify-between items-start">
      <span className="font-bold truncate">{data.id}</span>
      <span className="text-[9px] border border-slate-600 px-1 rounded">{data.parentIds.length} IN</span>
    </div>
    <div className="mt-2 text-slate-300 leading-tight truncate">
      &gt; {data.label}
    </div>
    <div className="absolute bottom-1 right-2 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
  </div>
);