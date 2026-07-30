import React from 'react';
import React, { useState, useEffect } from 'react';
import { FamilyMember } from '../../types';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Card from '../ui/Card';

interface MemberFormProps {
  member: Partial<FamilyMember> | null;
  members: FamilyMember[];
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export default function MemberForm({ member, members, onSubmit, onCancel }: MemberFormProps) {
  const [form, setForm] = useState<any>({
    name: '',
    generation: '',
    gender: '',
    fatherId: '',
    spouse: '',
    birthday: '',
    deathDate: '',
    isAlive: true,
    officialPosition: '',
    residencePlace: '',
    remarks: '',
    siblingOrder: '',
  });

  useEffect(() => {
    if (member) {
      setForm({
        ...member,
        generation: member.generation ?? '',
        siblingOrder: member.siblingOrder ?? '',
        fatherId: member.fatherId ?? '',
        isAlive: member.isAlive ?? true,
      });
    }
  }, [member]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setForm({ ...form, [name]: val });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      ...form,
      generation: form.generation ? parseInt(form.generation) : null,
      siblingOrder: form.siblingOrder ? parseInt(form.siblingOrder) : null,
      fatherId: form.fatherId || null,
      isAlive: form.isAlive === true || form.isAlive === 'true',
    };
    onSubmit(data);
  };

  return (
    <Card title={member?.id ? '编辑成员' : '添加成员'}>
      <form onSubmit={handleSubmit} className="space-y-3">
        <Input label="姓名" name="name" value={form.name} onChange={handleChange} required />
        <div className="grid grid-cols-2 gap-2">
          <Input label="世代" name="generation" type="number" value={form.generation} onChange={handleChange} />
          <Input label="排行" name="siblingOrder" type="number" value={form.siblingOrder} onChange={handleChange} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">性别</label>
          <select name="gender" value={form.gender || ''} onChange={handleChange} className="w-full border rounded p-2">
            <option value="">未选择</option>
            <option value="男">男</option>
            <option value="女">女</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">父亲</label>
          <select name="fatherId" value={form.fatherId || ''} onChange={handleChange} className="w-full border rounded p-2">
            <option value="">无</option>
            {members.filter(m => m.id !== member?.id).map(m => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
        </div>
        <Input label="配偶" name="spouse" value={form.spouse || ''} onChange={handleChange} />
        <div className="grid grid-cols-2 gap-2">
          <Input label="生日" name="birthday" type="date" value={form.birthday || ''} onChange={handleChange} />
          <Input label="忌日" name="deathDate" type="date" value={form.deathDate || ''} onChange={handleChange} />
        </div>
        <label className="flex items-center space-x-2">
          <input type="checkbox" name="isAlive" checked={form.isAlive} onChange={handleChange} />
          <span className="text-sm">在世</span>
        </label>
        <Input label="官职" name="officialPosition" value={form.officialPosition || ''} onChange={handleChange} />
        <Input label="居住地" name="residencePlace" value={form.residencePlace || ''} onChange={handleChange} />
        <div>
          <label className="block text-sm font-medium text-gray-700">备注</label>
          <textarea name="remarks" value={form.remarks || ''} onChange={handleChange} rows={3} className="w-full border rounded p-2" />
        </div>
        <div className="flex space-x-2 pt-2">
          <Button type="submit">{member?.id ? '更新' : '创建'}</Button>
          <Button variant="secondary" type="button" onClick={onCancel}>取消</Button>
        </div>
      </form>
    </Card>
  );
}
