import React from 'react';
import { GraphNodeData } from '../types';

interface CardNodeProps {
  data: GraphNodeData;
  width: number;
  height: number;
}

export const CardNode: React.FC<CardNodeProps> = ({ data, width, height }) => {
  const getTypeColor = (t?: string) => {
    switch(t) {
      case 'process': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'decision': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'output': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div 
      className={`flex flex-col p-3 rounded-lg shadow-sm border hover:shadow-md transition-all cursor-default overflow-hidden ${getTypeColor(data.type)}`}
      style={{ width, height }}
    >
      <div className="font-bold text-sm truncate mb-1" title={data.label}>{data.label || data.id}</div>
      <div className="text-xs opacity-75 truncate flex-1">{data.details || "No details"}</div>
      <div className="text-[10px] uppercase tracking-wider font-semibold mt-1 opacity-50 text-right">
        {data.type || 'Node'}
      </div>
    </div>
  );
};