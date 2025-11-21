import { GraphNodeData, LayoutConfig, LayoutResult, LayerInfo } from '../types';

interface InternalNode {
  id: string;
  width: number;
  height: number;
  x: number;
  y: number;
  layer: number;
  order: number;
  data: GraphNodeData;
  parents: string[];
}

/**
 * Step 1: Initialize internal node structure from raw data
 */
const initializeNodes = (data: GraphNodeData[], config: LayoutConfig): Map<string, InternalNode> => {
  const nodeMap = new Map<string, InternalNode>();
  data.forEach(d => {
    nodeMap.set(d.id, {
      id: d.id,
      width: config.nodeWidth,
      height: config.nodeHeight,
      x: 0,
      y: 0,
      layer: 0,
      order: 0,
      data: d,
      parents: d.parentIds || []
    });
  });
  return nodeMap;
};

/**
 * Step 2: Assign Layers (Rank) using Longest Path Algorithm
 * Detects cycles and breaks them by ignoring back-edges during calculation
 */
const assignLayers = (nodeMap: Map<string, InternalNode>): void => {
  const memoLayer = new Map<string, number>();
  const visiting = new Set<string>();

  function getLayer(nodeId: string): number {
    if (memoLayer.has(nodeId)) return memoLayer.get(nodeId)!;
    if (visiting.has(nodeId)) return 0; // Cycle detected, break
    
    visiting.add(nodeId);
    
    const node = nodeMap.get(nodeId);
    if (!node || node.parents.length === 0) {
        visiting.delete(nodeId);
        memoLayer.set(nodeId, 0);
        return 0;
    }
    
    let maxParentLayer = -1;
    for(const pid of node.parents) {
        maxParentLayer = Math.max(maxParentLayer, getLayer(pid));
    }
    
    visiting.delete(nodeId);
    const layer = maxParentLayer + 1;
    memoLayer.set(nodeId, layer);
    return layer;
  }

  // Calculate layers for all nodes
  Array.from(nodeMap.keys()).forEach(id => {
      const node = nodeMap.get(id)!;
      node.layer = getLayer(id);
  });
};

/**
 * Step 3: Group nodes by their assigned layer
 */
const groupNodesByLayer = (nodeMap: Map<string, InternalNode>): InternalNode[][] => {
  const layers: InternalNode[][] = [];
  nodeMap.forEach(n => {
      if (!layers[n.layer]) layers[n.layer] = [];
      layers[n.layer].push(n);
  });
  return layers;
};

/**
 * Step 4: Order nodes within layers to minimize edge crossings
 * Uses a simple barycenter heuristic (averaging parent positions)
 */
const orderNodesInLayers = (layers: InternalNode[][], nodeMap: Map<string, InternalNode>): void => {
  // Initial Sort: Alphabetical for deterministic results
  layers.forEach(layer => {
    if(layer) layer.sort((a, b) => a.id.localeCompare(b.id));
  });

  // Forward pass: Sort based on average parent position
  // We skip layer 0 as it has no parents
  for (let i = 1; i < layers.length; i++) {
    const layer = layers[i];
    if (!layer) continue;

    layer.forEach(node => {
      const parents = node.parents.map(pid => nodeMap.get(pid)).filter(Boolean) as InternalNode[];
      if (parents.length > 0) {
        // Calculate average "order" (index) of parents in the previous layer
        const sum = parents.reduce((acc, p) => {
            const pIndex = layers[p.layer].indexOf(p);
            return acc + (pIndex >= 0 ? pIndex : 0);
        }, 0);
        node.order = sum / parents.length;
      } else {
        node.order = layers[i].indexOf(node);
      }
    });

    // Sort current layer based on calculated order
    layer.sort((a, b) => a.order - b.order);
  }
};

/**
 * Step 5: Assign X, Y coordinates based on layer and order
 * returns dimensions of the graph and layer info
 */
const calculateCoordinates = (
    layers: InternalNode[][], 
    config: LayoutConfig
): { width: number; height: number; layerInfos: LayerInfo[] } => {
  const { nodeWidth, nodeHeight, rankSep, nodeSep } = config;
  
  // Calculate width of each layer
  const layerWidths = layers.map(layer => {
      if (!layer) return 0;
      return layer.length * nodeWidth + (layer.length - 1) * nodeSep;
  });
  
  const maxWidth = Math.max(...layerWidths, 0);
  const layerInfos: LayerInfo[] = [];

  layers.forEach((layer, layerIndex) => {
      if (!layer) return;
      const currentLayerWidth = layerWidths[layerIndex];
      // Center the layer
      const xOffset = (maxWidth - currentLayerWidth) / 2; 
      const y = layerIndex * (nodeHeight + rankSep) + nodeHeight / 2;

      layer.forEach((node, nodeIndex) => {
          node.x = xOffset + nodeIndex * (nodeWidth + nodeSep) + nodeWidth / 2;
          node.y = y;
      });

      layerInfos.push({
        index: layerIndex,
        y: y,
        height: nodeHeight + rankSep
      });
  });

  const totalHeight = layers.length * (nodeHeight + rankSep);

  return { width: maxWidth, height: totalHeight, layerInfos };
};

/**
 * Step 6: Generate edge paths between nodes
 */
const generateEdges = (nodeMap: Map<string, InternalNode>, config: LayoutConfig): any[] => {
    const edges: any[] = [];
    const { nodeHeight } = config;

    nodeMap.forEach(target => {
        target.parents.forEach(sourceId => {
            const source = nodeMap.get(sourceId);
            if (source) {
                edges.push({
                    source: source.id,
                    target: target.id,
                    points: [
                        { x: source.x, y: source.y + nodeHeight / 2 }, // Bottom of source
                        { x: target.x, y: target.y - nodeHeight / 2 }  // Top of target
                    ]
                });
            }
        });
    });
    return edges;
};

export const calculateLayout = (
  data: GraphNodeData[],
  config: LayoutConfig
): LayoutResult => {
  if (!data || data.length === 0) {
    return { nodes: [], edges: [], layers: [], width: 0, height: 0 };
  }

  // 1. Initialize
  const nodeMap = initializeNodes(data, config);

  // 2. Layer Assignment
  assignLayers(nodeMap);

  // 3. Grouping
  const layers = groupNodesByLayer(nodeMap);

  // 4. Ordering
  orderNodesInLayers(layers, nodeMap);

  // 5. Coordinates
  const dimensions = calculateCoordinates(layers, config);

  // 6. Edges
  const edges = generateEdges(nodeMap, config);

  // 7. Format Output
  const nodes = Array.from(nodeMap.values()).map(n => ({
      id: n.id,
      x: n.x,
      y: n.y,
      data: n.data
  }));

  return {
      nodes,
      edges,
      layers: dimensions.layerInfos,
      width: dimensions.width + 200, // Extra padding
      height: dimensions.height + 200
  };
};