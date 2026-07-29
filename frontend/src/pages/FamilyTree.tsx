import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../api/client";
import MemberList from "../components/family/MemberList";
import MemberForm from "../components/family/MemberForm";

export function FamilyTreePage() {
  const { user } = useAuth();
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingMember, setEditingMember] = useState<any | null>(null);

  const loadMembers = async () => {
    try {
      const data = await api.getMembers();
      setMembers(data);
    } catch (error) {
      console.error("Failed to load members:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, []);

  const handleCreate = async (data: any) => {
    await api.createMember(data);
    await loadMembers();
    setEditingMember(null);
  };

  const handleUpdate = async (data: any) => {
    if (editingMember) {
      await api.updateMember(editingMember.id, data);
      await loadMembers();
      setEditingMember(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("确定要删除该成员吗？")) {
      await api.deleteMember(id);
      await loadMembers();
    }
  };

  if (loading) return <div>加载中...</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">族谱管理</h1>
        <button
          onClick={() => setEditingMember({})}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          添加成员
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <MemberList
            members={members}
            onEdit={setEditingMember}
            onDelete={handleDelete}
          />
        </div>
        <div>
          {(editingMember !== null) && (
            <MemberForm
              member={editingMember}
              members={members}
              onSubmit={editingMember.id ? handleUpdate : handleCreate}
              onCancel={() => setEditingMember(null)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
