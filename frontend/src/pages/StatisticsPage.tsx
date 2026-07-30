import { useEffect, useState } from 'react';
import { api } from '../api/client';
import Statistics from '../components/statistics/Statistics';

export default function StatisticsPage() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    api.getStats().then(setStats).catch(console.error);
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">统计仪表盘</h1>
      {stats && <Statistics data={stats} />}
    </div>
  );
}
