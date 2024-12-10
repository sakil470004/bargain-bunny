// client/src/pages/UserDashboard.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import { useDashboard } from '../contexts/DashboardContext';

const UserDashboard = () => {
  const { loading, error } = useDashboard();

  if (loading) return <div>Loading dashboard...</div>;
  if (error) return <div>Error loading dashboard: {error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">
          Welcome back, {localStorage.getItem('userName')}
        </h1>
      </div>
      
      {/* Outlet renders the nested route components */}
      <Outlet />
    </div>
  );
};

export default UserDashboard;