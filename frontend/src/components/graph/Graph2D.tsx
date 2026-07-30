import React, { useCallback, useEffect, useState } from 'react';
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Background,
  Controls,
  MiniMap,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

interface Graph2DProps {
  data: { roots: any[]; all: any[] };
}

export default function Graph2D({ data }: Graph2DProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    if (!data) return;
    const { all } = data;
    const nodeMap = new Map();
    const nodeList: Node[] = [];
    const edgeList: Edge[] = [];

    all.forEach((m: any) => {
      const node: Node = {
        id: m.id,
        position: { x: Math.random() * 600, y: Math.random() * 400 },
        data: { label: m.name },
        style: {
          background: m.gender === '男' ? '#dbeafe' : '#fce7f3',
          border: '1px solid #ccc',
          borderRadius: '8px',
          padding: '8px 16px',
        },
      };
      nodeList.push(node);
      nodeMap.set(m.id, node);
    });

    all.forEach((m: any) => {
      if (m.fatherId && nodeMap.has(m.fatherId)) {
        edgeList.push({
          id: `${m.fatherId}-${m.id}`,
          source: m.fatherId,
          target: m.id,
          type: 'smoothstep',
        });
      }
    });

    setNodes(nodeList);
    setEdges(edgeList);
  }, [data, setNodes, setEdges]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
}
