// client/src/contexts/DashboardContext.jsx
import React, { createContext, useContext, useState } from 'react';

const DashboardContext = createContext();

export const DashboardProvider = ({ children }) => {
  // State for loading and error handling
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // State for user dashboard
  const [userStats, setUserStats] = useState({
    activeListings: 0,
    completedTransactions: 0,
    recentListings: [],
    recentTransactions: []
  });

  // State for admin dashboard
  const [adminStats, setAdminStats] = useState({
    userCount: 0,
    itemCount: 0,
    transactionCount: 0,
    recentTransactions: []
  });

  // State for listings and transactions
  const [listings, setListings] = useState([]);
  const [transactions, setTransactions] = useState([]);

  // Fetch user dashboard stats
  const fetchUserStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/dashboard/user-stats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.message);
      
      setUserStats(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch admin dashboard stats
  const fetchAdminStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.message);
      
      setAdminStats(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch user listings
  const fetchListings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/dashboard/listings', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.message);
      
      setListings(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch user transactions
  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/dashboard/transactions', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.message);
      
      setTransactions(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Values to be provided to consumers
  const value = {
    // States
    loading,
    error,
    userStats,
    adminStats,
    listings,
    transactions,
    // Functions
    fetchUserStats,
    fetchAdminStats,
    fetchListings,
    fetchTransactions
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};

// Custom hook for using the dashboard context
export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};