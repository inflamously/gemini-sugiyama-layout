import React from 'react';
import { GraphNodeData, ViewType } from '../types';

interface NodeProps {
  data: GraphNodeData;
  viewType: ViewType;
  width: number;
  height: number;
}

const SimpleNode: React.FC<NodeProps> = ({ data, width, height }) => (
  <div 
    className="flex items-center justify-center bg-white border-2 border-slate-300 rounded-full shadow-sm text-slate-700 font-medium text-sm hover:border-indigo-500 hover:text-indigo-600 transition-colors cursor-pointer"
    style={{ width, height }}
  >
    {data.label || data.id}
  </div>
);

const CardNode: React.FC<NodeProps> = ({ data, width, height }) => {
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

const TechnicalNode: React.FC<NodeProps> = ({ data, width, height }) => (
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

export const NodeRenderer: React.FC<NodeProps> = (props) => {
  switch (props.viewType) {
    case ViewType.CARD: return <CardNode {...props} />;
    case ViewType.TECHNICAL: return <TechnicalNode {...props} />;
    case ViewType.SIMPLE: 
    default: 
      return <SimpleNode {...props} />;
  }
};
