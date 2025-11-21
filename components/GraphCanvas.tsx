import React from 'react';
import { LayoutResult, ViewType } from '../types';
import { DebugLayer } from './DebugLayer';
import { EdgesLayer } from './EdgesLayer';
import { NodesLayer } from './NodesLayer';

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
          <DebugLayer layers={layers} nodeHeight={nodeHeight} />
        )}

        {/* Layer 1: SVG Edges */}
        <EdgesLayer edges={edges} viewType={viewType} />

        {/* Layer 2: HTML Nodes */}
        <NodesLayer 
          nodes={nodes} 
          viewType={viewType} 
          nodeWidth={nodeWidth} 
          nodeHeight={nodeHeight} 
        />
      </div>
    </div>
  );
};