import React, { useMemo } from 'react';
import { RenderedEdge, ViewType } from '../types';
import { curveBumpY, line } from 'd3-shape';

interface EdgesLayerProps {
  edges: RenderedEdge[];
  viewType: ViewType;
}

export const EdgesLayer: React.FC<EdgesLayerProps> = ({ edges, viewType }) => {
  // D3 line generator for curved edges
  const lineGenerator = useMemo(() => {
    return line<{ x: number; y: number }>()
      .x(d => d.x)
      .y(d => d.y)
      .curve(curveBumpY);
  }, []);

  return (
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
  );
};