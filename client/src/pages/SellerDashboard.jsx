import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, DollarSign, ShoppingCart, Settings, Edit, Trash2, Plus, FileDown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';

const DashboardCard = ({ icon: Icon, title, value, description }) => (
  <div className="bg-white rounded-xl p-6 border border-gray-100 hover:border-gray-200 transition-all duration-300 hover:shadow-lg">
    <div className="flex items-start space-x-4">
      <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-50 text-blue-600">
        <Icon className="w-6 h-6" strokeWidth={1.5} />
      </div>
      <div className="flex-1">
        <h3 className="text-2xl font-bold text-gray-900 mb-1">{value}</h3>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <p className="text-xs text-gray-400">{description}</p>
      </div>
    </div>
  </div>
);

const ItemRow = ({ item, onEdit, onDelete }) => {
  const statusColors = {
    available: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    sold: 'bg-gray-50 text-gray-700 border-gray-100',
    pending: 'bg-amber-50 text-amber-700 border-amber-100'
  };

  return (
    <div className="flex items-center justify-between p-4 hover:bg-gray-50/50 rounded-lg transition-colors duration-200">
      <div className="flex items-center space-x-4 flex-1">
        <div className="w-14 h-14 bg-gray-100 rounded-lg overflow-hidden">
          <img 
            src={item.images?.[0] || '/api/placeholder/56/56'} 
            alt={item.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/api/placeholder/56/56';
            }}
          />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900">{item.title}</h4>
          <p className="text-sm text-gray-500">{item.category}</p>
        </div>
        <div className="hidden sm:flex items-center space-x-4">
          <span className="text-lg font-semibold text-gray-900">${item.price}</span>
          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[item.status]}`}>
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </span>
        </div>
      </div>
      <div className="flex items-center space-x-2 ml-4">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onEdit(item._id);
          }}
          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
        >
          <Edit className="w-4 h-4" />
        </button>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            if (window.confirm('Are you sure you want to delete this item?')) {
              onDelete(item._id);
            }
          }}
          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
        >
          <Trash2 className="w-4 h-4" />
        </button>
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-pulse text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Seller Dashboard</h1>
            <p className="text-gray-500 mt-1">Welcome back, {user?.username}</p>
          </div>
          <div className="flex space-x-3">
            <button 
              onClick={() => navigate('/create-item')}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                       transition-colors duration-200 font-medium text-sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </button>
            <button className="flex items-center px-4 py-2 bg-white border border-gray-200 text-gray-700 
                           rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium text-sm">
              <FileDown className="w-4 h-4 mr-2" />
              Export
            </button>
          </div>
        </div>

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

        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="border-b border-gray-100">
            <div className="flex">
              <button
                onClick={() => setActiveTab('listings')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors duration-200 ${
                  activeTab === 'listings'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                My Listings
              </button>
              <button
                onClick={() => setActiveTab('sales')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors duration-200 ${
                  activeTab === 'sales'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Sales History
              </button>
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'listings' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">Your Items</h2>
                  <div className="text-sm text-gray-500">{items.length} items total</div>
                </div>
                <div className="space-y-2">
                  {items.map(item => (
                    <ItemRow 
                      key={item._id} 
                      item={item} 
                      onEdit={(id) => navigate(`/edit-item/${id}`)}
                      onDelete={async (id) => {
                        try {
                          await api.delete(`/items/${id}`);
                          toast.success('Item deleted successfully');
                          fetchItems();
                        } catch (error) {
                          toast.error('Failed to delete item');
                        }
                      }}
                    />
                  ))}
                  {items.length === 0 && (
                    <div className="text-center py-12">
                      <p className="text-gray-500">No items found. Start by adding your first item!</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'sales' && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Sales History</h2>
                <div className="text-center py-12 text-gray-500">
                  Sales history will be displayed here
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;