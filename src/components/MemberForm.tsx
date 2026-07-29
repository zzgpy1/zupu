'use client';
import { useState } from 'react';
import UploadButton from './UploadButton';

interface MemberFormProps {
  initialData?: any;
  onSubmit: (data: any) => void;
}

export default function MemberForm({ initialData = {}, onSubmit }: MemberFormProps) {
  const [form, setForm] = useState({
    name: initialData.name || '',
    generationIndex: initialData.generationIndex || '',
    generationChar: initialData.generationChar || '',
    gender: initialData.gender || 'unknown',
    birthYear: initialData.birthYear || '',
    birthPlace: initialData.birthPlace || '',
    deathYear: initialData.deathYear || '',
    deathPlace: initialData.deathPlace || '',
    residence: initialData.residence || '',
    officialTitle: initialData.officialTitle || '',
    biography: initialData.biography || '',
    avatarUrl: initialData.avatarUrl || '',
    isAlive: initialData.isAlive || false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleUpload = (url: string) => {
    setForm(prev => ({ ...prev, avatarUrl: url }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow">
      <div>
        <label className="block font-medium">姓名 *</label>
        <input name="name" value={form.name} onChange={handleChange} required className="w-full border p-2 rounded" />
      </div>
      <div>
        <label className="block font-medium">世代</label>
        <input name="generationIndex" type="number" value={form.generationIndex} onChange={handleChange} className="w-full border p-2 rounded" />
      </div>
      <div>
        <label className="block font-medium">字辈</label>
        <input name="generationChar" value={form.generationChar} onChange={handleChange} className="w-full border p-2 rounded" />
      </div>
      <div>
        <label className="block font-medium">性别</label>
        <select name="gender" value={form.gender} onChange={handleChange} className="w-full border p-2 rounded">
          <option value="male">男</option>
          <option value="female">女</option>
          <option value="unknown">未知</option>
        </select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label>出生年</label>
          <input name="birthYear" type="number" value={form.birthYear} onChange={handleChange} className="w-full border p-2 rounded" />
        </div>
        <div>
          <label>卒年</label>
          <input name="deathYear" type="number" value={form.deathYear} onChange={handleChange} className="w-full border p-2 rounded" />
        </div>
      </div>
      <div>
        <label>籍贯</label>
        <input name="birthPlace" value={form.birthPlace} onChange={handleChange} className="w-full border p-2 rounded" />
      </div>
      <div>
        <label>居住地</label>
        <input name="residence" value={form.residence} onChange={handleChange} className="w-full border p-2 rounded" />
      </div>
      <div>
        <label>官职</label>
        <input name="officialTitle" value={form.officialTitle} onChange={handleChange} className="w-full border p-2 rounded" />
      </div>
      <div>
        <label>生平简介</label>
        <textarea name="biography" rows={3} value={form.biography} onChange={handleChange} className="w-full border p-2 rounded" />
      </div>
      <div>
        <label>头像</label>
        <div className="flex items-center gap-2">
          <input name="avatarUrl" value={form.avatarUrl} onChange={handleChange} className="flex-1 border p-2 rounded" placeholder="图片URL" />
          <UploadButton onUpload={handleUpload} />
        </div>
        {form.avatarUrl && <img src={form.avatarUrl} alt="预览" className="w-16 h-16 object-cover rounded mt-2" />}
      </div>
      <div className="flex items-center gap-2">
        <input name="isAlive" type="checkbox" checked={form.isAlive} onChange={handleChange} />
        <label>在世</label>
      </div>
      <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">保存</button>
    </form>
  );
}
