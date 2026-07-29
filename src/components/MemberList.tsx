'use client';
import { useState } from 'react';
import { Member } from '@/lib/db/schema';
import Link from 'next/link';

export default function MemberList({ initialMembers }: { initialMembers: Member[] }) {
  const [members, setMembers] = useState(initialMembers);

  const handleDelete = async (id: string) => {
    if (!confirm('确定删除此成员？')) return;
    const res = await fetch(`/api/members/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setMembers(members.filter(m => m.id !== id));
    } else {
      alert('删除失败，请检查权限');
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {members.map((m) => (
        <div key={m.id} className="border rounded p-4 bg-white shadow hover:shadow-md transition">
          {m.avatarUrl && (
            <img src={m.avatarUrl} alt={m.name} className="w-20 h-20 object-cover rounded-full mx-auto" />
          )}
          <h2 className="text-xl font-semibold text-center mt-2">{m.name}</h2>
          <p className="text-center text-gray-600">第 {m.generationIndex || '?'} 代</p>
          {m.birthYear && <p className="text-sm">生：{m.birthYear}</p>}
          {m.deathYear && <p className="text-sm">卒：{m.deathYear}</p>}
          <div className="flex justify-center gap-2 mt-2">
            <Link href={`/members/${m.id}`} className="text-blue-600 text-sm hover:underline">查看</Link>
            <Link href={`/members/${m.id}/tree`} className="text-green-600 text-sm hover:underline">族谱树</Link>
            <button onClick={() => handleDelete(m.id)} className="text-red-600 text-sm hover:underline">删除</button>
          </div>
        </div>
      ))}
    </div>
  );
}
