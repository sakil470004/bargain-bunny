// client/src/components/layouts/DashboardLayout.jsx
import { Outlet, Navigate } from 'react-router-dom';
import { useDashboard } from '../../contexts/DashboardContext';

const DashboardLayout = () => {
  // Check if user is logged in
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

// client/src/components/layouts/Header.jsx
const Header = () => {
  return (
    <header className="bg-white shadow">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <div className="flex items-center gap-4">
            <button className="text-gray-600 hover:text-gray-900">
              <span className="sr-only">Notifications</span>
              {/* Add notification icon */}
            </button>
            <button className="text-gray-600 hover:text-gray-900">
              <span className="sr-only">Profile</span>
              {/* Add profile icon/image */}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

// client/src/components/layouts/Sidebar.jsx
const Sidebar = () => {
  const isAdmin = localStorage.getItem('role') === 'admin';

  return (
    <aside className="w-64 bg-white shadow-sm min-h-screen">
      <nav className="mt-5 px-2">
        {isAdmin ? (
          <div className="space-y-1">
            <SidebarLink to="/dashboard" label="Overview" />
            <SidebarLink to="/dashboard/users" label="Users" />
            <SidebarLink to="/dashboard/transactions" label="Transactions" />
            <SidebarLink to="/dashboard/reports" label="Reports" />
          </div>
        ) : (
          <div className="space-y-1">
            <SidebarLink to="/dashboard" label="Overview" />
            <SidebarLink to="/dashboard/listings" label="My Listings" />
            <SidebarLink to="/dashboard/transactions" label="My Transactions" />
            <SidebarLink to="/dashboard/profile" label="Profile" />
          </div>
        )}
      </nav>
    </aside>
  );
};

// Reusable SidebarLink component
const SidebarLink = ({ to, label }) => (
  <a
    href={to}
    className="group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
  >
    {label}
  </a>
);

export default DashboardLayout;