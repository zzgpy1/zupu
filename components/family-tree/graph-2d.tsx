'use client';

import { useEffect, useRef, useState } from 'react';
import ReactFlow, {
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  MiniMap,
  Panel,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

interface Member {
  id: string;
  name: string;
  generation: number;
  fatherId: string | null;
  motherId: string | null;
  gender: '男' | '女';
  spouse: string | null;
}

interface Graph2DProps {
  members: Member[];
  rootId?: string;
}

const nodeWidth = 120;
const nodeHeight = 50;
const levelHeight = 80;
const siblingGap = 20;

export function Graph2D({ members, rootId }: Graph2DProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  useEffect(() => {
    if (!members.length) return;

    // 构建节点映射
    const memberMap = new Map<string, Member>();
    members.forEach(m => memberMap.set(m.id, m));

    // 找到根节点
    let root: Member | undefined;
    if (rootId) {
      root = memberMap.get(rootId);
    }
    if (!root) {
      root = members.find(m => !m.fatherId && !m.motherId);
    }
    if (!root) {
      root = members[0];
    }

    // 按世代分组
    const generations = new Map<number, Member[]>();
    members.forEach(m => {
      const gen = m.generation || 0;
      if (!generations.has(gen)) generations.set(gen, []);
      generations.get(gen)!.push(m);
    });

    // 排序世代
    const sortedGens = Array.from(generations.keys()).sort((a, b) => a - b);
    
    // 计算节点位置
    const flowNodes: Node[] = [];
    const flowEdges: Edge[] = [];

    sortedGens.forEach((gen, genIndex) => {
      const genMembers = generations.get(gen) || [];
      const totalWidth = genMembers.length * (nodeWidth + siblingGap) - siblingGap;
      const startX = -totalWidth / 2;

      genMembers.forEach((member, index) => {
        const x = startX + index * (nodeWidth + siblingGap) + nodeWidth / 2;
        const y = genIndex * (nodeHeight + levelHeight) + nodeHeight / 2;

        flowNodes.push({
          id: member.id,
          position: { x, y },
          data: { 
            label: (
              <div className="text-center p-1">
                <div className="font-medium text-sm">{member.name}</div>
                {member.spouse && (
                  <div className="text-xs text-muted-foreground">配偶: {member.spouse}</div>
                )}
              </div>
            )
          },
          style: {
            width: nodeWidth,
            height: nodeHeight,
            background: member.gender === '男' 
              ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
              : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            color: 'white',
            borderRadius: '8px',
            border: selectedNode === member.id ? '3px solid #ffd700' : 'none',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            cursor: 'pointer',
          },
        });

        // 添加父子边
        if (member.fatherId) {
          flowEdges.push({
            id: `${member.fatherId}-${member.id}`,
            source: member.fatherId,
            target: member.id,
            style: { stroke: '#888', strokeWidth: 2 },
            animated: selectedNode === member.fatherId || selectedNode === member.id,
          });
        }
        if (member.motherId) {
          flowEdges.push({
            id: `${member.motherId}-${member.id}`,
            source: member.motherId,
            target: member.id,
            style: { stroke: '#888', strokeWidth: 2, strokeDasharray: '5,5' },
            animated: selectedNode === member.motherId || selectedNode === member.id,
          });
        }
      });
    });

    setNodes(flowNodes);
    setEdges(flowEdges);
  }, [members, rootId, selectedNode]);

  const onNodeClick = (_: React.MouseEvent, node: Node) => {
    setSelectedNode(selectedNode === node.id ? null : node.id);
  };

  return (
    <div className="w-full h-[600px] bg-slate-50 dark:bg-slate-900 rounded-lg overflow-hidden">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        fitView
        attributionPosition="bottom-right"
        proOptions={{ hideAttribution: true }}
      >
        <Background />
        <Controls />
        <MiniMap />
        <Panel position="top-right" className="bg-white dark:bg-slate-800 p-2 rounded-lg shadow-lg">
          <span className="text-sm text-muted-foreground">
            共 {members.length} 位成员
          </span>
        </Panel>
      </ReactFlow>
    </div>
  );
}
