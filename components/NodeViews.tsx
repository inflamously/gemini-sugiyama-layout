import React from 'react';
import { GraphNodeData, ViewType } from '../types';
import { SimpleNode } from './SimpleNode';
import { CardNode } from './CardNode';
import { TechnicalNode } from './TechnicalNode';

interface NodeRendererProps {
  data: GraphNodeData;
  viewType: ViewType;
  width: number;
  height: number;
}

export const NodeRenderer: React.FC<NodeRendererProps> = (props) => {
  const { viewType, ...nodeProps } = props;
  
  switch (viewType) {
    case ViewType.CARD: 
      return <CardNode {...nodeProps} />;
    case ViewType.TECHNICAL: 
      return <TechnicalNode {...nodeProps} />;
    case ViewType.SIMPLE: 
    default: 
      return <SimpleNode {...nodeProps} />;
  }
};