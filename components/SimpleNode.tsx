import React from 'react';
import { GraphNodeData } from '../types';

interface SimpleNodeProps {
  data: GraphNodeData;
  width: number;
  height: number;
}

export const SimpleNode: React.FC<SimpleNodeProps> = ({ data, width, height }) => (
  <div 
    className="flex items-center justify-center bg-white border-2 border-slate-300 rounded-full shadow-sm text-slate-700 font-medium text-sm hover:border-indigo-500 hover:text-indigo-600 transition-colors cursor-pointer"
    style={{ width, height }}
  >
    {data.label || data.id}
  </div>
);