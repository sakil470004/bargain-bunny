// client/src/pages/UserDashboard.jsx
import React from 'react';
import { useDashboard } from '../contexts/DashboardContext';
import Overview from '../components/dashboard/user/Overview';
import MyListings from '../components/dashboard/user/MyListings';

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
      
      {/* Main Content */}
      <div className="grid grid-cols-1 gap-6">
        <Overview />
        <MyListings />
      </div>
    </div>
  );
};

export default UserDashboard;