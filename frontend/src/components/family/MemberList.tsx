import React from 'react';
import { FamilyMember } from '../../types';
import Card from '../ui/Card';
import Button from '../ui/Button';

interface MemberListProps {
  members: FamilyMember[];
  onEdit: (member: FamilyMember) => void;
  onDelete: (id: string) => void;
}

export default function MemberList({ members, onEdit, onDelete }: MemberListProps) {
  if (!members.length) return <p className="text-gray-500">暂无成员，请添加。</p>;

  return (
    <div className="space-y-3">
      {members.map((m) => (
        <Card key={m.id} className="flex justify-between items-center">
          <div>
            <p className="font-medium">{m.name}</p>
            <p className="text-sm text-gray-500">
              世代 {m.generation ?? '?'} · {m.gender || '未填'}
              {m.birthday && ` · 生: ${m.birthday}`}
            </p>
          </div>
          <div className="space-x-2">
            <Button variant="secondary" size="sm" onClick={() => onEdit(m)}>编辑</Button>
            <Button variant="danger" size="sm" onClick={() => onDelete(m.id)}>删除</Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
