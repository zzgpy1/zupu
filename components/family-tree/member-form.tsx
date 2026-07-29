'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface MemberFormProps {
  treeId: string;
  editData?: any;
}

export function MemberForm({ treeId, editData }: MemberFormProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: editData?.name || '',
    generation: editData?.generation || '',
    gender: editData?.gender || '男',
    fatherId: editData?.fatherId || '',
    motherId: editData?.motherId || '',
    spouse: editData?.spouse || '',
    birthday: editData?.birthday || '',
    deathDate: editData?.deathDate || '',
    isAlive: editData?.isAlive ?? true,
    residencePlace: editData?.residencePlace || '',
    officialPosition: editData?.officialPosition || '',
    biography: editData?.biography || '',
    remarks: editData?.remarks || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = editData ? `/api/family-members/${editData.id}` : '/api/family-members';
      const method = editData ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          treeId,
          generation: formData.generation ? parseInt(formData.generation) : null,
        }),
      });

      if (!response.ok) throw new Error('保存失败');
      
      setOpen(false);
      router.refresh();
    } catch (error) {
      alert('保存失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          添加成员
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editData ? '编辑成员' : '添加成员'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 基本信息 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">姓名 *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">性别</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="男">男</option>
                <option value="女">女</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">世代</label>
              <input
                type="number"
                value={formData.generation}
                onChange={(e) => setFormData({ ...formData, generation: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="如：1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">配偶</label>
              <input
                type="text"
                value={formData.spouse}
                onChange={(e) => setFormData({ ...formData, spouse: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="配偶姓名"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">出生日期</label>
              <input
                type="date"
                value={formData.birthday}
                onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">去世日期</label>
              <input
                type="date"
                value={formData.deathDate}
                onChange={(e) => setFormData({ ...formData, deathDate: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                disabled={formData.isAlive}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              <input
                type="checkbox"
                checked={formData.isAlive}
                onChange={(e) => setFormData({ ...formData, isAlive: e.target.checked })}
                className="mr-2"
              />
              在世
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">居住地</label>
            <input
              type="text"
              value={formData.residencePlace}
              onChange={(e) => setFormData({ ...formData, residencePlace: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">官职/身份</label>
            <input
              type="text"
              value={formData.officialPosition}
              onChange={(e) => setFormData({ ...formData, officialPosition: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">生平事迹</label>
            <textarea
              value={formData.biography}
              onChange={(e) => setFormData({ ...formData, biography: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg min-h-[100px]"
              placeholder="详细记录家族成员的生平事迹..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">备注</label>
            <textarea
              value={formData.remarks}
              onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="其他补充信息"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              取消
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? '保存中...' : '保存'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
