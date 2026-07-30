import { useEffect, useState } from 'react';
import { api } from '../api/client';
import Graph3D from '../components/graph/Graph3D';

export default function Graph3DPage() {
  const [treeData, setTreeData] = useState<any>(null);

  useEffect(() => {
    api.getTree().then(setTreeData).catch(console.error);
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">3D 关系网</h1>
      <div className="h-[600px] bg-white rounded shadow">
        {treeData && <Graph3D data={treeData} />}
      </div>
    </div>
  );
}
