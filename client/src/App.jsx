import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Suspense, lazy } from 'react';  // Added this import
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/shared/Navbar';
import { ItemProvider } from './contexts/ItemContext';
import CreateItem from './pages/CreateItem';
import ItemDetails from './pages/ItemDetails';
// Lazy load pages
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
// const Search = lazy(() => import('./pages/Search'));

function App() {
  return (
    <Router>
      <AuthProvider>
      <ItemProvider>
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
              </Routes>
            </Suspense>
          </main>
        </div>
        </ItemProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;