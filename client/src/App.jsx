import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Suspense, lazy } from 'react';  // Added this import
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/shared/Navbar';
import { ItemProvider } from './contexts/ItemContext';
import CreateItem from './pages/CreateItem';
import ItemDetails from './pages/ItemDetails';
import TransactionHistory from './pages/TransactionHistory';
import { DashboardProvider } from './contexts/DashboardContext';
// dashboard components
import DashboardLayout from './components/layouts/DashboardLayout';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import Overview from './components/dashboard/user/Overview';
import MyListings from './components/dashboard/user/MyListings';
// Lazy load pages
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));

// const Search = lazy(() => import('./pages/Search'));

function App() {
  const isAdmin = () => localStorage.getItem('role') === 'admin';
  return (
    <Router>
      <AuthProvider>
        <ItemProvider>
          <DashboardProvider>
            <Toaster position="top-right" />
            <div className="min-h-screen bg-gray-50">
              <Navbar />
              <main className="max-w-6xl mx-auto px-4 py-8">
                <Suspense fallback={<div>Loading...</div>}>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/create-item" element={<CreateItem />} />
                    {/* <Route path="/search" element={<Search />} /> */}
                    <Route path="/item/:id" element={<ItemDetails />} />
                    <Route path="/transactions" element={<TransactionHistory />} />
ß
                    <Route path="/dashboard" element={<DashboardLayout />}>
                      {/* Index route redirects to appropriate overview */}
                      <Route
                        index
                        element={
                          <Navigate
                            to={isAdmin() ? "/dashboard/admin" : "/dashboard/user"}
                            replace
                          />
                        }
                      />

                      {/* User Dashboard Routes */}
                      <Route path="user" element={<UserDashboard />}>
                        <Route index element={<Overview />} />
                        <Route path="listings" element={<MyListings />} />
                        <Route path="transactions" element={<div>Transactions Page</div>} />
                        <Route path="profile" element={<div>Profile Page</div>} />
                      </Route>

                      {/* Admin Dashboard Routes */}
                      <Route path="admin" element={<AdminDashboard />}>
                        <Route index element={<div>Admin Overview</div>} />
                        <Route path="users" element={<div>Users Management</div>} />
                        <Route path="transactions" element={<div>All Transactions</div>} />
                        <Route path="reports" element={<div>Reports</div>} />
                      </Route>
                    </Route>
                  </Routes>
                </Suspense>
              </main>
            </div>
          </DashboardProvider>
        </ItemProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;