// client/src/contexts/DashboardContext.jsx
import  { createContext, useContext, useReducer } from 'react';

const DashboardContext = createContext();

// Action Types
const ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_USER_STATS: 'SET_USER_STATS',
  SET_ADMIN_STATS: 'SET_ADMIN_STATS',
  SET_LISTINGS: 'SET_LISTINGS',
  SET_TRANSACTIONS: 'SET_TRANSACTIONS',
};

// Initial State
const initialState = {
  loading: false,
  error: null,
  userStats: {
    activeListings: 0,
    completedTransactions: 0,
    recentListings: [],
    recentTransactions: []
  },
  adminStats: {
    userCount: 0,
    itemCount: 0,
    transactionCount: 0,
    recentTransactions: []
  },
  listings: [],
  transactions: []
};

// Reducer
const dashboardReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
    case ACTIONS.SET_ERROR:
      return { ...state, error: action.payload };
    case ACTIONS.SET_USER_STATS:
      return { ...state, userStats: action.payload };
    case ACTIONS.SET_ADMIN_STATS:
      return { ...state, adminStats: action.payload };
    case ACTIONS.SET_LISTINGS:
      return { ...state, listings: action.payload };
    case ACTIONS.SET_TRANSACTIONS:
      return { ...state, transactions: action.payload };
    default:
      return state;
  }
};

// Provider Component
export const DashboardProvider = ({ children }) => {
  const [state, dispatch] = useReducer(dashboardReducer, initialState);

  // API calls
  const fetchUserStats = async () => {
    try {
      dispatch({ type: ACTIONS.SET_LOADING, payload: true });
      const response = await fetch('/api/dashboard/user-stats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.message);
      
      dispatch({ type: ACTIONS.SET_USER_STATS, payload: data });
    } catch (error) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
    } finally {
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
    }
  };

  const fetchAdminStats = async () => {
    try {
      dispatch({ type: ACTIONS.SET_LOADING, payload: true });
      const response = await fetch('/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.message);
      
      dispatch({ type: ACTIONS.SET_ADMIN_STATS, payload: data });
    } catch (error) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
    } finally {
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
    }
  };

  const fetchListings = async () => {
    try {
      dispatch({ type: ACTIONS.SET_LOADING, payload: true });
      const response = await fetch('/api/dashboard/listings', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.message);
      
      dispatch({ type: ACTIONS.SET_LISTINGS, payload: data });
    } catch (error) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
    } finally {
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
    }
  };

  const fetchTransactions = async () => {
    try {
      dispatch({ type: ACTIONS.SET_LOADING, payload: true });
      const response = await fetch('/api/dashboard/transactions', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.message);
      
      dispatch({ type: ACTIONS.SET_TRANSACTIONS, payload: data });
    } catch (error) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
    } finally {
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
    }
  };

  return (
    <DashboardContext.Provider 
      value={{
        ...state,
        fetchUserStats,
        fetchAdminStats,
        fetchListings,
        fetchTransactions
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

// Custom Hook
export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};