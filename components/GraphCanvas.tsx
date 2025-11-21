import React, { useMemo } from 'react';
import { LayoutResult, ViewType } from '../types';
import { curveBumpY, line } from 'd3-shape';
import { NodeRenderer } from './NodeViews';

interface GraphCanvasProps {
  layout: LayoutResult;
  viewType: ViewType;
  nodeWidth: number;
  nodeHeight: number;
  showLayers: boolean;
}

export const GraphCanvas: React.FC<GraphCanvasProps> = ({ 
  layout, 
  viewType,
  nodeWidth,
  nodeHeight,
  showLayers
}) => {
  const { nodes, edges, layers, width, height } = layout;

  // D3 line generator for curved edges
  const lineGenerator = useMemo(() => {
    return line<{ x: number; y: number }>()
      .x(d => d.x)
      .y(d => d.y)
      .curve(curveBumpY);
  }, []);

  return (
    <div 
      className="relative overflow-auto bg-white border rounded-lg shadow-inner"
      style={{ width: '100%', height: '100%' }}
    >
      <div 
        className="relative origin-top-left transition-transform duration-300"
        style={{ 
          width: Math.max(width, 100), 
          height: Math.max(height, 100),
          minWidth: '100%',
          minHeight: '100%',
          padding: '40px',
          boxSizing: 'content-box'
        }}
      >
        {/* Layer 0: Debug Layers (Ranks) */}
        {showLayers && (
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
        )}

        {/* Layer 1: SVG Edges */}
        <svg 
          className="absolute top-0 left-0 pointer-events-none"
          style={{ 
            width: '100%',
            height: '100%',
            top: 0,
            left: 0,
            zIndex: 0
          }}
        >
          <defs>
            <marker
              id="arrowhead"
              viewBox="0 -5 10 10"
              refX={8}
              refY={0}
              markerWidth={6}
              markerHeight={6}
              orient="auto"
              className={viewType === ViewType.TECHNICAL ? "text-slate-700" : "text-slate-400"}
            >
              <path d="M0,-5L10,0L0,5" fill="currentColor" />
            </marker>
          </defs>
          {edges.map((edge, i) => (
            <path
              key={`${edge.source}-${edge.target}-${i}`}
              d={lineGenerator(edge.points) || ""}
              fill="none"
              stroke="currentColor"
              className={viewType === ViewType.TECHNICAL ? "text-slate-700" : "text-slate-300"}
              strokeWidth={viewType === ViewType.TECHNICAL ? 1 : 2}
              markerEnd="url(#arrowhead)"
              transform="translate(40, 40)"
            />
          ))}
        </svg>

        {/* Layer 2: HTML Nodes */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-10">
          {nodes.map((node) => (
            <div
              key={node.id}
              className="absolute pointer-events-auto transition-all duration-500 ease-in-out"
              style={{
                left: node.x - nodeWidth / 2 + 40, // +40 for padding
                top: node.y - nodeHeight / 2 + 40,
                width: nodeWidth,
                height: nodeHeight,
              }}
            >
              <NodeRenderer 
                data={node.data} 
                viewType={viewType} 
                width={nodeWidth} 
                height={nodeHeight} 
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};