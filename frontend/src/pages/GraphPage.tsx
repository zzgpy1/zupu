import React from 'react';
import { useEffect, useState } from 'react';
import { api } from '../api/client';
import Graph2D from '../components/graph/Graph2D';

export default function GraphPage() {
  const [treeData, setTreeData] = useState<any>(null);

  useEffect(() => {
    api.getTree().then(setTreeData).catch(console.error);
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">2D 族谱图</h1>
      <div className="h-[600px] bg-white rounded shadow">
        {treeData && <Graph2D data={treeData} />}
      </div>
    </div>
  );
}
