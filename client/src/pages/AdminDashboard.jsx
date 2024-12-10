import React from 'react';
import { useDashboard } from '../contexts/DashboardContext';

const AdminDashboard = () => {
  const { 
    loading, 
    error, 
    adminStats, 
    fetchAdminStats 
  } = useDashboard();

  React.useEffect(() => {
    fetchAdminStats();
  }, []);

  if (loading) return <div>Loading dashboard...</div>;
  if (error) return <div>Error loading dashboard: {error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">
          Admin Dashboard
        </h1>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard 
          title="Total Users" 
          value={adminStats.userCount} 
        />
        <StatsCard 
          title="Total Items" 
          value={adminStats.itemCount} 
        />
        <StatsCard 
          title="Total Transactions" 
          value={adminStats.transactionCount} 
        />
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium mb-4">Recent Transactions</h2>
        <div className="space-y-4">
          {adminStats.recentTransactions.map((transaction) => (
            <TransactionItem 
              key={transaction._id} 
              transaction={transaction} 
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Reusable components for AdminDashboard
const StatsCard = ({ title, value }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
    <p className="mt-2 text-3xl font-semibold">{value}</p>
  </div>
);

const TransactionItem = ({ transaction }) => (
  <div className="flex items-center justify-between border-b pb-4">
    <div>
      <p className="font-medium">
        {transaction.item.title}
      </p>
      <p className="text-sm text-gray-500">
        {`${transaction.buyer.name} purchased from ${transaction.seller.name}`}
      </p>
    </div>
    <span className="text-gray-500">
      ${transaction.amount}
    </span>
  </div>
);

export default AdminDashboard;