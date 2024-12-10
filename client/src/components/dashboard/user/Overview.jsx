// client/src/components/dashboard/user/Overview.jsx
import React, { useEffect } from 'react';
import { useDashboard } from '../../../contexts/DashboardContext';

const Overview = () => {
  const { 
    loading, 
    error, 
    userStats, 
    fetchUserStats 
  } = useDashboard();

  useEffect(() => {
    fetchUserStats();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard 
          title="Active Listings" 
          value={userStats.activeListings}
        />
        <StatsCard 
          title="Completed Sales" 
          value={userStats.completedTransactions}
        />
        <StatsCard 
          title="Total Revenue" 
          value={`$${calculateTotalRevenue(userStats.recentTransactions)}`}
        />
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {userStats.recentTransactions.map((transaction) => (
            <ActivityItem key={transaction._id} item={transaction} />
          ))}
        </div>
      </div>
    </div>
  );
};

// StatsCard Component
const StatsCard = ({ title, value }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
    <p className="mt-2 text-3xl font-semibold">{value}</p>
  </div>
);

// ActivityItem Component
const ActivityItem = ({ item }) => (
  <div className="flex items-center justify-between border-b pb-4">
    <div>
      <p className="font-medium">{item.item.title}</p>
      <p className="text-sm text-gray-500">
        {new Date(item.createdAt).toLocaleDateString()}
      </p>
    </div>
    <span className={`px-3 py-1 rounded-full text-sm ${
      item.status === 'completed' 
        ? 'bg-green-100 text-green-800' 
        : 'bg-yellow-100 text-yellow-800'
    }`}>
      {item.status}
    </span>
  </div>
);

// Helper function to calculate total revenue
const calculateTotalRevenue = (transactions) => {
  return transactions
    .filter(t => t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0)
    .toFixed(2);
};

export default Overview;