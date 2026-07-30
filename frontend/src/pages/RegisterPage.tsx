import React from 'react';
import Register from '../components/auth/Register';

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <h2 className="text-center text-3xl font-bold text-gray-900">注册新账号</h2>
        <Register />
      </div>
    </div>
  );
}
