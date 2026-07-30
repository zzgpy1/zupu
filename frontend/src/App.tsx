import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import FamilyTree from './pages/FamilyTree';
import GraphPage from './pages/GraphPage';
import Graph3DPage from './pages/Graph3DPage';
import StatisticsPage from './pages/StatisticsPage';
import TimelinePage from './pages/TimelinePage';
import Layout from './components/ui/Layout';

function PrivateRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div className="p-4">加载中...</div>;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/" element={
        <PrivateRoute>
          <Layout>
            <Dashboard />
          </Layout>
        </PrivateRoute>
      } />
      <Route path="/family" element={
        <PrivateRoute>
          <Layout>
            <FamilyTree />
          </Layout>
        </PrivateRoute>
      } />
      <Route path="/graph" element={
        <PrivateRoute>
          <Layout>
            <GraphPage />
          </Layout>
        </PrivateRoute>
      } />
      <Route path="/graph3d" element={
        <PrivateRoute>
          <Layout>
            <Graph3DPage />
          </Layout>
        </PrivateRoute>
      } />
      <Route path="/stats" element={
        <PrivateRoute>
          <Layout>
            <StatisticsPage />
          </Layout>
        </PrivateRoute>
      } />
      <Route path="/timeline" element={
        <PrivateRoute>
          <Layout>
            <TimelinePage />
          </Layout>
        </PrivateRoute>
      } />
    </Routes>
  );
}

export default App;