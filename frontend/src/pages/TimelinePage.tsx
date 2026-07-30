import React from 'react';
import { useEffect, useState } from 'react';
import { api } from '../api/client';
import Timeline from '../components/timeline/Timeline';

export default function TimelinePage() {
  const [members, setMembers] = useState<any[]>([]);

  useEffect(() => {
    api.getMembers().then(setMembers).catch(console.error);
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">时间轴</h1>
      <Timeline members={members} />
    </div>
  );
}
