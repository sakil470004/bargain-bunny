import { Link } from 'react-router-dom';
import { FaHome, FaSearch, FaUser } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold text-primary">
            BargainBunny
          </Link>
          
          <div className="flex items-center gap-4">
            <Link to="/" className="text-gray-600 hover:text-primary">
              <FaHome size={20} />
            </Link>
            <Link to="/search" className="text-gray-600 hover:text-primary">
              <FaSearch size={20} />
            </Link>
            {user ? (
              <button
                onClick={logout}
                className="text-gray-600 hover:text-primary"
              >
                <FaUser size={20} />
              </button>
            ) : (
              <Link to="/login" className="btn btn-primary">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;