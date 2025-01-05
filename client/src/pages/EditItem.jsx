import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaMapMarkerAlt, FaImage, FaArrowLeft } from 'react-icons/fa';
import toast from 'react-hot-toast';
import api from '../utils/api';
import Map from '../components/Map';

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

  const InputField = ({ label, name, type = "text", value, onChange, required = true, ...props }) => (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 
                 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
        {...props}
      />
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
            >
              <FaArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Edit Item Details</h1>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <InputField
                  label="Title"
                  name="title"
                  value={item.title}
                  onChange={handleChange}
                  placeholder="Item title"
                />

                <InputField
                  label="Price"
                  name="price"
                  type="number"
                  value={item.price}
                  onChange={handleChange}
                  step="0.01"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Description</label>
                <textarea
                  name="description"
                  value={item.description}
                  onChange={handleChange}
                  rows="4"
                  className="mt-1 w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 
                           focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Category</label>
                  <select
                    name="category"
                    value={item.category}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 
                             focus:ring-blue-500 focus:border-transparent transition-all duration-200"
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

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Condition</label>
                  <select
                    name="condition"
                    value={item.condition}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 
                             focus:ring-blue-500 focus:border-transparent transition-all duration-200"
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
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">Images</label>
                  <span className="text-xs text-gray-500">Separate URLs with commas</span>
                </div>
                <input
                  type="text"
                  value={item.images.join(', ')}
                  onChange={handleImageChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 
                           focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter image URLs separated by commas"
                />
                <div className="flex gap-2 overflow-x-auto py-2">
                  {item.images.map((url, index) => (
                    <div key={index} className="relative flex-shrink-0">
                      <img
                        src={url}
                        alt={`Preview ${index + 1}`}
                        className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/api/placeholder/80/80';
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {item.location && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Location</label>
                  <div className="flex items-center gap-2 text-gray-600 bg-gray-50 p-3 rounded-lg">
                    <FaMapMarkerAlt className="text-blue-500" />
                    <span>{item.location.address}</span>
                  </div>
                  <div className="h-48 rounded-lg overflow-hidden border border-gray-200">
                    <Map location={item.location} />
                  </div>
                </div>
              )}
            </div>

            <div className="mt-8 flex justify-end gap-4">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 
                         transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 
                         transition-colors duration-200"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditItem;