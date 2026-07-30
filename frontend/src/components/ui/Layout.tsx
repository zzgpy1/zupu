import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex space-x-8">
              <Link to="/" className="flex items-center text-gray-700 hover:text-blue-600">首页</Link>
              <Link to="/family" className="flex items-center text-gray-700 hover:text-blue-600">族谱管理</Link>
              <Link to="/graph" className="flex items-center text-gray-700 hover:text-blue-600">2D族谱图</Link>
              <Link to="/graph3d" className="flex items-center text-gray-700 hover:text-blue-600">3D关系网</Link>
              <Link to="/stats" className="flex items-center text-gray-700 hover:text-blue-600">统计</Link>
              <Link to="/timeline" className="flex items-center text-gray-700 hover:text-blue-600">时间轴</Link>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">{user?.username}</span>
              <button
                onClick={handleLogout}
                className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
              >
                登出
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="flex-1 bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
