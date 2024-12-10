// client/src/components/layouts/SidebarLink.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';

const SidebarLink = ({ to, label, Icon }) => (
  <NavLink
    to={to}
    className={({ isActive }) => `
      group flex items-center px-2 py-2 text-base font-medium rounded-md
      ${isActive 
        ? 'bg-gray-100 text-blue-600' 
        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
    `}
    end={to.split('/').length === 3} // Only exact match for root routes
  >
    {Icon && (
      <Icon 
        className={`mr-3 h-5 w-5 flex-shrink-0`}
        aria-hidden="true" 
      />
    )}
    {label}
  </NavLink>
);

export default SidebarLink;