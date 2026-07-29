'use client';
import { useState } from 'react';
import { Member, Relationship } from '@/lib/db/schema';
import MemberForm from './MemberForm';

interface MemberDetailClientProps {
  member: Member;
  relationships: Relationship[];
  relatedMembers: Member[];
  isAuth: boolean;
}

export default function MemberDetailClient({
  member,
  relationships,
  relatedMembers,
  isAuth,
}: MemberDetailClientProps) {
  const [editing, setEditing] = useState(false);
  const [currentMember, setCurrentMember] = useState(member);

  // 解析关系展示
  const getRelatedName = (id: string) => {
    const found = relatedMembers.find(m => m.id === id);
    return found ? found.name : '未知';
  };

  const handleUpdate = async (data: any) => {
    const res = await fetch(`/api/members/${currentMember.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      const updated = await res.json();
      setCurrentMember(updated);
      setEditing(false);
      alert('更新成功');
    } else {
      alert('更新失败');
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow space-y-4">
      {!editing ? (
        <>
          <div className="flex justify-between items-start">
            <div>
              <p><strong>世代：</strong>{currentMember.generationIndex || '未设置'}</p>
              <p><strong>字辈：</strong>{currentMember.generationChar || '无'}</p>
              <p><strong>性别：</strong>{currentMember.gender === 'male' ? '男' : currentMember.gender === 'female' ? '女' : '未知'}</p>
              <p><strong>生年：</strong>{currentMember.birthYear || '未知'}</p>
              <p><strong>卒年：</strong>{currentMember.deathYear || '未知'}</p>
              <p><strong>籍贯：</strong>{currentMember.birthPlace || '无'}</p>
              <p><strong>居住地：</strong>{currentMember.residence || '无'}</p>
              <p><strong>官职：</strong>{currentMember.officialTitle || '无'}</p>
            </div>
            {currentMember.avatarUrl && (
              <img src={currentMember.avatarUrl} alt="头像" className="w-32 h-32 object-cover rounded" />
            )}
          </div>

          <div>
            <h3 className="font-semibold">生平简介</h3>
            <p className="whitespace-pre-wrap">{currentMember.biography || '暂无'}</p>
          </div>

          {/* 显示关系 */}
          {relationships.length > 0 && (
            <div>
              <h3 className="font-semibold">关系</h3>
              <ul className="list-disc pl-5">
                {relationships.map(rel => {
                  const isSelf = rel.memberId === currentMember.id;
                  const otherId = isSelf ? rel.relatedMemberId : rel.memberId;
                  const otherName = getRelatedName(otherId);
                  const relationTypeMap: Record<string, string> = {
                    father: '父亲',
                    mother: '母亲',
                    child: '子女',
                    spouse: '配偶',
                    sibling: '兄弟姐妹',
                  };
                  const displayType = relationTypeMap[rel.relationType] || rel.relationType;
                  return (
                    <li key={rel.id}>
                      {isSelf ? `${displayType}：${otherName}` : `${otherName} 的 ${displayType}`}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {isAuth && (
            <div className="flex gap-2">
              <button
                onClick={() => setEditing(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                编辑
              </button>
            </div>
          )}
        </>
      ) : (
        <div>
          <h2 className="text-xl font-bold mb-2">编辑成员</h2>
          <MemberForm initialData={currentMember} onSubmit={handleUpdate} />
          <button
            onClick={() => setEditing(false)}
            className="mt-2 text-gray-600 hover:underline"
          >
            取消编辑
          </button>
        </div>
      )}
    </div>
  );
}
