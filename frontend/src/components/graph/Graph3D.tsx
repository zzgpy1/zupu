import React from 'react';
import React, { useEffect, useRef } from 'react';
import ForceGraph3D from 'react-force-graph-3d';

interface Graph3DProps {
  data: { roots: any[]; all: any[] };
}

export default function Graph3D({ data }: Graph3DProps) {
  const graphData = {
    nodes: data?.all.map((m: any) => ({
      id: m.id,
      name: m.name,
      gender: m.gender,
    })) || [],
    links: data?.all
      .filter((m: any) => m.fatherId)
      .map((m: any) => ({
        source: m.fatherId,
        target: m.id,
      })) || [],
  };

  return (
    <ForceGraph3D
      graphData={graphData}
      nodeLabel="name"
      nodeColor={(node: any) => node.gender === '男' ? '#3b82f6' : '#ec4899'}
      linkColor={() => '#9ca3af'}
      linkWidth={2}
      nodeAutoColorBy="group"
      width={800}
      height={600}
    />
  );
}
