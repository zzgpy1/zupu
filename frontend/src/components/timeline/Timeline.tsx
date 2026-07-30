import React from 'react';
import { FamilyMember } from '../../types';

interface TimelineProps {
  members: FamilyMember[];
}

export default function Timeline({ members }: TimelineProps) {
  // 按出生日期排序
  const sorted = [...members]
    .filter(m => m.birthday)
    .sort((a, b) => (a.birthday! < b.birthday! ? -1 : 1));

  return (
    <div className="relative pl-8 border-l-2 border-gray-300">
      {sorted.map((m) => (
        <div key={m.id} className="mb-6">
          <div className="absolute -left-3 w-3 h-3 bg-blue-500 rounded-full"></div>
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-bold">{m.name}</h3>
            <p className="text-sm text-gray-600">
              出生: {m.birthday} {m.deathDate && `- 逝世: ${m.deathDate}`}
            </p>
            {m.officialPosition && <p className="text-sm">官职: {m.officialPosition}</p>}
          </div>
        </div>
      ))}
      {!sorted.length && <p className="text-gray-500">暂无成员生日数据</p>}
    </div>
  );
}
