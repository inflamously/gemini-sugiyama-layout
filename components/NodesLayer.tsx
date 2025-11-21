import React from 'react';
import { RenderedNode, ViewType } from '../types';
import { NodeRenderer } from './NodeViews';

interface NodesLayerProps {
  nodes: RenderedNode[];
  viewType: ViewType;
  nodeWidth: number;
  nodeHeight: number;
}

export const NodesLayer: React.FC<NodesLayerProps> = ({ nodes, viewType, nodeWidth, nodeHeight }) => {
  return (
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
  );
};