import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import api from '../utils/api';
import Map from '../components/Map';
import { FaMapMarkerAlt } from 'react-icons/fa';

const EditItem = () => {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [item, setItem] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    condition: '',
    location: {
      address: '',
      coordinates: [],
      type: 'Point'
    },
    images: []
  });

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await api.get(`/items/${itemId}`);
        setItem(response.data);
      } catch (error) {
        toast.error('Failed to load item details');
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [itemId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(item);
      await api.put(`/items/${itemId}`, item);
      toast.success('Item updated successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to update item');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'price') {
      setItem(prev => ({
        ...prev,
        [name]: parseFloat(value) || value
      }));
    } else {
      setItem(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleImageChange = (e) => {
    const imageUrls = e.target.value.split(',').map(url => url.trim());
    setItem(prev => ({
      ...prev,
      images: imageUrls
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Edit Item</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title
          </label>
          <input
            type="text"
            name="title"
            value={item.title}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={item.description}
            onChange={handleChange}
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price
          </label>
          <input
            type="number"
            name="price"
            value={item.price}
            onChange={handleChange}
            step="0.01"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            name="category"
            value={item.category}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select a category</option>
            <option value="Electronics">Electronics</option>
            <option value="Furniture">Furniture</option>
            <option value="Clothing">Clothing</option>
            <option value="Books">Books</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Condition
          </label>
          <select
            name="condition"
            value={item.condition}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select condition</option>
            <option value="New">New</option>
            <option value="Like New">Like New</option>
            <option value="Good">Good</option>
            <option value="Fair">Fair</option>
            <option value="Poor">Poor</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Images (Comma-separated URLs)
          </label>
          <input
            type="text"
            value={item.images.join(', ')}
            onChange={handleImageChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter image URLs separated by commas"
          />
          {/* Preview current images */}
          <div className="mt-2 flex gap-2 overflow-x-auto">
            {item.images.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`Preview ${index + 1}`}
                className="w-20 h-20 object-cover rounded"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/100?text=Error';
                }}
              />
            ))}
          </div>
        </div>
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors duration-150"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors duration-150"
          >
            Save Changes
          </button>
        </div>
        {item.location && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <div className="flex items-center gap-2 text-gray-600">
              <FaMapMarkerAlt />
              <span>{item.location.address}</span>
            </div>
            <div className="mt-2 h-48 -z-10">
              <Map className='-z-10' location={item.location} />
            </div>
          </div>
        )}

        
      </form>
    </div>
  );
};

export default EditItem;