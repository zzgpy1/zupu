'use client';
import { useRef } from 'react';

interface UploadButtonProps {
  onUpload: (url: string) => void;
}

export default function UploadButton({ onUpload }: UploadButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    if (res.ok) {
      const data = await res.json();
      onUpload(data.url);
    } else {
      alert('上传失败');
    }
  };

  return (
    <>
      <input type="file" ref={inputRef} onChange={handleUpload} className="hidden" accept="image/*" />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300 text-sm"
      >
        上传图片
      </button>
    </>
  );
}
