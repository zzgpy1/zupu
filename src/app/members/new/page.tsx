'use client';
import { useRouter } from 'next/navigation';
import MemberForm from '@/components/MemberForm';

export default function NewMemberPage() {
  const router = useRouter();

  const handleSubmit = async (data: any) => {
    const res = await fetch('/api/members', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      router.push('/members');
    } else {
      alert('创建失败，请检查权限或网络');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">新增成员</h1>
      <MemberForm onSubmit={handleSubmit} />
    </div>
  );
}
