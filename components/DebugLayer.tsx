import React from 'react';
import { LayerInfo } from '../types';

interface DebugLayerProps {
  layers: LayerInfo[];
  nodeHeight: number;
}

export const DebugLayer: React.FC<DebugLayerProps> = ({ layers, nodeHeight }) => {
  return (
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
      {layers.map((layer) => (
         <div
          key={layer.index}
          className="absolute w-full border-b-2 border-dashed border-indigo-200 bg-indigo-50/50 flex items-start px-2"
          style={{
            top: (layer.y - nodeHeight / 2) + 40 - 20, // -20 padding for visual separation
            height: layer.height,
            left: 0
          }}
         >
           <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-widest mt-1">
             Rank {layer.index}
           </span>
         </div>
      ))}
    </div>
  );
};