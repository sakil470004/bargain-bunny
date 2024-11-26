import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useItems } from '../contexts/ItemContext';
import { FaTag, FaMoneyBill, FaInfo, FaImage } from 'react-icons/fa';
import toast from 'react-hot-toast';

const CreateItem = () => {
  const navigate = useNavigate();
  const { createItem } = useItems();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    condition: 'Good',
    category: 'Other',
    images: [""], // Array for multiple image URLs
    location: {
      type: 'Point',
      coordinates: [0, 0]
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Filter out empty image URLs
      const cleanedFormData = {
        ...formData,
        images: formData.images.filter(url => url.trim() !== '')
      };

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const itemWithLocation = {
            ...cleanedFormData,
            location: {
              type: 'Point',
              coordinates: [position.coords.longitude, position.coords.latitude]
            }
          };
          console.log(itemWithLocation);
          await createItem(itemWithLocation);
          navigate('/');
        },
        (error) => {
          toast.error('Please enable location access to create an item');
        }
      );
    } catch (error) {
      console.error('Error creating item:', error);
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

        <button type="submit" className="btn btn-primary w-full">
          Create Item
        </button>
      </form>
    </div>
  );
};

export default CreateItem;