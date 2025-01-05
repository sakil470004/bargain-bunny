import { Link } from 'react-router-dom';
import { FaBookOpen, FaExchangeAlt, FaHome, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          <Link 
            to="/" 
            className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors duration-150"
          >
            BargainBunny
          </Link>

          <div className="flex items-center space-x-6">
            <Link 
              to="/"
              className="flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-150"
              title="Home"
            >
              <div className="p-2 hover:bg-blue-50 rounded-full">
                <FaHome className="w-5 h-5" />
              </div>
            </Link>
            
            {user ? (
              <>
                <Link 
                  to="/dashboard"
                  className="flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-150"
                  title="Dashboard"
                >
                  <div className="p-2 hover:bg-blue-50 rounded-full">
                    <FaBookOpen className="w-5 h-5" />
                  </div>
                </Link>

                <Link 
                  to="/transactions"
                  className="flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-150"
                  title={`Transactions - ${user.username}`}
                >
                  <div className="p-2 hover:bg-blue-50 rounded-full">
                    <FaExchangeAlt className="w-5 h-5" />
                  </div>
                </Link>

                <div className="border-l border-gray-200 h-6 mx-2"></div>

                <button
                  onClick={logout}
                  title={`Logout ${user.username}`}
                  className="flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-150"
                >
                  <div className="p-2 hover:bg-blue-50 rounded-full">
                    <FaSignOutAlt className="w-5 h-5" />
                  </div>
                </button>
              </>
            ) : (
              <Link 
                to="/login" 
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 
                         transition-colors duration-150 text-sm font-medium"
              >
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