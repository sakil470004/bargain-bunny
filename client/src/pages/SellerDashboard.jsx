import React, { useState, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';
import { Package, DollarSign, ShoppingCart, Settings, Edit, Trash2 } from 'lucide-react';

import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';

const DashboardCard = ({ icon: Icon, title, value, description }) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <div className="flex items-center justify-between space-x-4">
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100">
        <Icon className="w-6 h-6 text-blue-600" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <h3 className="text-2xl font-bold">{value}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  </div>
);

const ItemRow = ({ item, onEdit, onDelete }) => {
  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit(item._id);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this item?')) {
      onDelete(item._id);
    }
  };

  return (
    <div className="flex items-center justify-between p-4 border-b hover:bg-gray-50 transition-colors duration-150">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-gray-200 rounded-md overflow-hidden">
          <img 
            src={item.images?.[0] || '/api/placeholder/48/48'} 
            alt={item.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/100?text=No+Image';
            }}
          />
        </div>
        <div>
          <h4 className="font-medium">{item.title}</h4>
          <p className="text-sm text-gray-600">{item.category}</p>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <span className="font-medium">${item.price}</span>
        <span className={`px-2 py-1 rounded-full text-xs ${
          item.status === 'available' ? 'bg-green-100 text-green-800' :
          item.status === 'sold' ? 'bg-gray-100 text-gray-800' :
          'bg-yellow-100 text-yellow-800'
        }`}>
          {item.status}
        </span>
        <div className="flex space-x-2">
          <button 
            onClick={handleEdit}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors duration-150"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button 
            onClick={handleDelete}
            className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors duration-150"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
const SellerDashboard = () => {
  const [activeTab, setActiveTab] = useState('listings');
  const navigate = useNavigate();
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await api.get('/items/user/items');
      setItems(response.data);
    } catch (error) {
      toast.error('Failed to load items');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (itemId) => {
    navigate(`/edit-item/${itemId}`);
  };

  const handleDelete = async (itemId) => {
    try {
      await api.delete(`/items/${itemId}`);
      toast.success('Item deleted successfully');
      fetchItems(); // Refresh the list
    } catch (error) {
      toast.error('Failed to delete item');
    }
  };

  const handleAddNew = () => {
    navigate('/create-item');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }


  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Seller Dashboard</h1>
        <p className="text-gray-600">Manage your listings and track performance</p>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <DashboardCard
          icon={Package}
          title="Active Listings"
          value="12"
          description="Total active items"
        />
        <DashboardCard
          icon={DollarSign}
          title="Total Sales"
          value="$2,850"
          description="Last 30 days"
        />
        <DashboardCard
          icon={ShoppingCart}
          title="Sold Items"
          value="8"
          description="Last 30 days"
        />
        <DashboardCard
          icon={Settings}
          title="Pending"
          value="3"
          description="Awaiting action"
        />
      </div>

      {/* Custom Tabs */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab('listings')}
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'listings'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              My Listings
            </button>
            <button
              onClick={() => setActiveTab('sales')}
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'sales'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Sales History
            </button>
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'listings' && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Your Items</h2>
              <div className="divide-y border-t border-b">
                {items.map(item => (
                  <ItemRow 
                    key={item._id} 
                    item={item} 
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </div>
          )}

          {activeTab === 'sales' && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Sales History</h2>
              <div className="text-gray-600">
                Sales history will be displayed here
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex justify-end space-x-4">
        <button 
          onClick={handleAddNew}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-150"
        >
          Add New Item
        </button>
        <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors duration-150">
          Export Data
        </button>
      </div>
    </div>
  );
};

export default SellerDashboard;