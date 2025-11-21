export interface GraphNodeData {
  id: string;
  parentIds: string[];
  label?: string;
  type?: 'default' | 'process' | 'decision' | 'output';
  details?: string;
}

export interface LayoutConfig {
  nodeWidth: number;
  nodeHeight: number;
  rankSep: number; // Vertical separation
  nodeSep: number; // Horizontal separation
}

export interface RenderedNode {
  id: string;
  x: number;
  y: number;
  data: GraphNodeData;
}

export interface RenderedEdge {
  source: string;
  target: string;
  points: { x: number; y: number }[];
}

export interface LayerInfo {
  y: number;
  height: number;
  index: number;
}

export interface LayoutResult {
  nodes: RenderedNode[];
  edges: RenderedEdge[];
  layers: LayerInfo[];
  width: number;
  height: number;
}

export enum ViewType {
  SIMPLE = 'SIMPLE',
  CARD = 'CARD',
  TECHNICAL = 'TECHNICAL'
}