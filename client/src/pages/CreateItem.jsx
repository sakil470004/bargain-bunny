import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useItems } from '../contexts/ItemContext';
import { FaTag, FaMoneyBill, FaInfo, FaImage } from 'react-icons/fa';
import toast from 'react-hot-toast';
import LocationInput from '../components/LocationInput';

const CreateItem = () => {
  const navigate = useNavigate();
  const { createItem } = useItems();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    condition: 'Good',
    category: 'Other',
    images: [""],
    location: {
      type: 'Point',
      coordinates: [],
      address: '',
      city: '',
      state: '',
      country: ''
    }
  });

  const handleLocationSelect = (locationData) => {
    if (!locationData) return;
    
    setFormData(prev => ({
      ...prev,
      location: {
        type: 'Point',
        coordinates: locationData.coordinates || [],
        address: locationData.address || '',
        city: locationData.city || '',
        state: locationData.state || '',
        country: locationData.country || ''
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validate location data
      if (!formData.location.address || !formData.location.coordinates?.length) {
        toast.error('Please select a valid location');
        return;
      }

      // Filter out empty image URLs
      const cleanedFormData = { 
        ...formData,
        images: formData.images.filter(url => url.trim() !== '')
      };

      await createItem(cleanedFormData);
      toast.success('Item created successfully!');
      navigate('/');
    } catch (error) {
      console.error('Error creating item:', error);
      toast.error('Failed to create item. Please try again.');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (index, value) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData({
      ...formData,
      images: newImages
    });
  };

  const addImageField = () => {
    setFormData({
      ...formData,
      images: [...formData.images, '']
    });
  };

  const removeImageField = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      images: newImages
    });
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-3xl font-bold text-center mb-6">Create New Item</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title Input */}
        <div>
          <div className="relative">
            <FaTag className="absolute top-3 left-3 text-gray-400" />
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Item Title"
              className="input pl-10"
              required
            />
          </div>
        </div>

        {/* Description Input */}
        <div>
          <div className="relative">
            <FaInfo className="absolute top-3 left-3 text-gray-400" />
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Description"
              className="input pl-10 h-32"
              required
            />
          </div>
        </div>

        {/* Price Input */}
        <div>
          <div className="relative">
            <FaMoneyBill className="absolute top-3 left-3 text-gray-400" />
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Price"
              className="input pl-10"
              required
            />
          </div>
        </div>

        {/* Image URLs */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Images</label>
          {formData.images.map((url, index) => (
            <div key={index} className="flex gap-2">
              <div className="relative flex-1">
                <FaImage className="absolute top-3 left-3 text-gray-400" />
                <input
                  type="url"
                  value={url}
                  onChange={(e) => handleImageChange(index, e.target.value)}
                  placeholder="Image URL"
                  className="input pl-10 w-full"
                />
              </div>
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => removeImageField(index)}
                  className="btn bg-red-500 hover:bg-red-600 text-white"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addImageField}
            className="btn bg-gray-500 hover:bg-gray-600 text-white w-full"
          >
            Add Another Image
          </button>
        </div>

        {/* Condition and Category Selects */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <select
              name="condition"
              value={formData.condition}
              onChange={handleChange}
              className="input"
            >
              <option value="New">New</option>
              <option value="Like New">Like New</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
              <option value="Poor">Poor</option>
            </select>
          </div>

          <div>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="input"
            >
              <option value="Electronics">Electronics</option>
              <option value="Furniture">Furniture</option>
              <option value="Clothing">Clothing</option>
              <option value="Books">Books</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        {/* Location Input */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Location
          </label>
          <div className="flex gap-2">
            <div className="flex-1">
              <LocationInput 
                onLocationSelect={handleLocationSelect}
                initialValue={formData.location.address}
              />
            </div>
            <button 
              type="button"
              onClick={() => {
                if (!navigator.geolocation) {
                  toast.error('Geolocation is not supported by your browser');
                  return;
                }
                
                toast.loading('Getting your location...', { id: 'location' });
                navigator.geolocation.getCurrentPosition(
                  async (position) => {
                    try {
                      // Use Mapbox Reverse Geocoding API to get address details
                      const { latitude, longitude } = position.coords;
                      const response = await fetch(
                        `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${import.meta.env.VITE_MAPBOX_TOKEN}`
                      );
                      const data = await response.json();
                      
                      if (data.features && data.features.length > 0) {
                        const feature = data.features[0];
                        const addressComponents = {
                          address: feature.place_name,
                          coordinates: [longitude, latitude],
                          city: feature.context?.find(c => c.id.startsWith('place'))?.text || '',
                          state: feature.context?.find(c => c.id.startsWith('region'))?.text || '',
                          country: feature.context?.find(c => c.id.startsWith('country'))?.text || ''
                        };
                        handleLocationSelect(addressComponents);
                        toast.success('Location updated!', { id: 'location' });
                      }
                    } catch (error) {
                      console.error('Error getting location details:', error);
                      toast.error('Failed to get location details', { id: 'location' });
                    }
                  },
                  (error) => {
                    console.error('Error getting location:', error);
                    toast.error('Failed to get your location. Please ensure location access is enabled.', { id: 'location' });
                  }
                );
              }}
              className="btn bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          {!formData.location.address && (
            <p className="text-sm text-red-500">Please select a valid location</p>
          )}
        </div>

        <button 
          type="submit" 
          className="btn btn-primary w-full"
          disabled={!formData.location.address}
        >
          Create Item
        </button>
      </form>
    </div>
  );
};
export default CreateItem;