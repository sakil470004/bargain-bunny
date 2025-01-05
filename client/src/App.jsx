import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Suspense, lazy } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/shared/Navbar';
import Footer from './components/shared/Footer';
import { ItemProvider } from './contexts/ItemContext';
import CreateItem from './pages/CreateItem';
import ItemDetails from './pages/ItemDetails';
import TransactionHistory from './pages/TransactionHistory';
import SellerDashboard from './pages/SellerDashboard';
import EditItem from './pages/EditItem';

// Lazy load pages
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));

// AppContent component to use useLocation
const AppContent = () => {
  const location = useLocation();
  const isAuthPage = ['/login', '/register'].includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col">
      {!isAuthPage && <Navbar />}
      <main className="flex-grow">
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-gray-600">Loading...</div>
          </div>
        }>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/create-item" element={<CreateItem />} />
            <Route path="/item/:id" element={<ItemDetails />} />
            <Route path="/transactions" element={<TransactionHistory />} />
            <Route path="/dashboard" element={<SellerDashboard />} />
            <Route path="/edit-item/:itemId" element={<EditItem />} />
          </Routes>
        </Suspense>
      </main>
      {!isAuthPage && <Footer />}
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <ItemProvider>
          <Toaster position="top-right" />
          <AppContent />
        </ItemProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;