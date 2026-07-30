import React from 'react';
import { useEffect, useState } from 'react';
import { api } from '../api/client';
import Card from '../components/ui/Card';

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    api.getStats().then(setStats).catch(console.error);
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">仪表盘</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card title="总成员">{stats?.total ?? 0}</Card>
        <Card title="在世">{stats?.alive ?? 0}</Card>
        <Card title="男性">{stats?.male ?? 0}</Card>
        <Card title="女性">{stats?.female ?? 0}</Card>
      </div>
      {stats?.generationDistribution && (
        <Card title="世代分布" className="mt-6">
          <pre className="text-sm">{JSON.stringify(stats.generationDistribution, null, 2)}</pre>
        </Card>
      )}
    </div>
  );
}
