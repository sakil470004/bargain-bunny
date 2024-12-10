// client/src/components/layouts/Sidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  ShoppingBag,
  BarChart,
  Settings
} from 'lucide-react';
import SidebarLink from '../../../../ client/src/components/layouts/SidebarLink';

const Sidebar = () => {
  const isAdmin = localStorage.getItem('role') === 'admin';
  const basePath = isAdmin ? '/dashboard/admin' : '/dashboard/user';

  const userLinks = [
    { to: `${basePath}`, label: 'Overview', Icon: LayoutDashboard },
    { to: `${basePath}/listings`, label: 'My Listings', Icon: ShoppingBag },
    { to: `${basePath}/transactions`, label: 'My Transactions', Icon: FileText },
    { to: `${basePath}/profile`, label: 'Profile', Icon: Settings }
  ];

  const adminLinks = [
    { to: `${basePath}`, label: 'Overview', Icon: LayoutDashboard },
    { to: `${basePath}/users`, label: 'Users', Icon: Users },
    { to: `${basePath}/transactions`, label: 'Transactions', Icon: FileText },
    { to: `${basePath}/reports`, label: 'Reports', Icon: BarChart }
  ];

  const links = isAdmin ? adminLinks : userLinks;

  return (
    <aside className="w-64 bg-white shadow-sm min-h-screen">
      <nav className="mt-5 px-2">
        <div className="space-y-1">
          {links.map((link) => (
            <SidebarLink
              key={link.to} 
              {...link} 
            />
          ))}
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
