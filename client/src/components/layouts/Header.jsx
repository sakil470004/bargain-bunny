// client/src/components/layouts/Header.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, User } from 'lucide-react';

const Header = () => {
  const userName = localStorage.getItem('userName');

  return (
    <header className="bg-white shadow">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          <Link to="/dashboard" className="text-2xl font-semibold text-gray-900">
            BargainBunny
          </Link>
          
          <div className="flex items-center gap-4">
            <button 
              className="text-gray-600 hover:text-gray-900 p-2 rounded-full hover:bg-gray-100"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
            </button>
            
            <div className="relative group">
              <button 
                className="flex items-center text-gray-600 hover:text-gray-900"
                aria-label="User menu"
              >
                <span className="mr-2 text-sm hidden sm:block">{userName}</span>
                <User className="h-5 w-5" />
              </button>
              {/* Add dropdown menu if needed */}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;