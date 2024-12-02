import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaUser, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import toast from 'react-hot-toast';
import api from '../utils/api';
import Map from '../components/Map';
// for payment
import PaymentModal from '../components/PaymentModal';

const ItemDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  // for payment
  const [showPayment, setShowPayment] = useState(false);
  const handlePaymentSuccess = async () => {
    // Update item status or handle success
    toast.success('Item purchased successfully!');
  };

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await api.get(`/items/${id}`);
        setItem(response.data);
      } catch (error) {
        toast.error('Failed to load item details');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="text-center mt-10">
        <h2 className="text-2xl">Item not found</h2>
      </div>
    );
  }

  const handleContact = () => {
    // For now, just show the seller's information
    toast.success(`Contact ${item.seller.username} about this item`);
    // Later we can implement a messaging system
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Images Section */}
        <div className="space-y-4">
          <div className="bg-gray-200 rounded-lg overflow-hidden h-96">
            {item.images && item.images.length > 0 ? (
              <img
                src={item.images[currentImageIndex]}
                alt={item.title}
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                No Image Available
              </div>
            )}
          </div>

          {/* Thumbnail Images */}
          {item.images && item.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {item.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className={`w-20 h-20 object-cover cursor-pointer rounded ${currentImageIndex === index ? 'border-2 border-primary' : ''
                    }`}
                  onClick={() => setCurrentImageIndex(index)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Details Section */}
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">{item.title}</h1>
          <p className="text-2xl font-bold text-green-600">${item.price}</p>

          <div className="space-y-4">
            <div className="flex items-center gap-2 text-gray-600">
              <FaUser />
              <span>Seller: {item.seller.username}</span>
            </div>
            {/* <div className="flex items-center gap-2 text-gray-600">
              <FaMapMarkerAlt />
              <span>Location available upon contact</span>
            </div> */}

            {item.location && (
              <div className="mt-6">
                <h3 className="text-xl font-semibold mb-2">Location</h3>
                <p className="mb-2">{item.location.address}</p>
                <Map location={item.location} />
              </div>
            )}
            <div className="flex items-center gap-2 text-gray-600">
              <FaClock />
              <span>Posted: {new Date(item.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">Condition</h3>
            <p className="text-gray-600">{item.condition}</p>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">Description</h3>
            <p className="text-gray-600">{item.description}</p>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">Category</h3>
            <p className="text-gray-600">{item.category}</p>
          </div>

          {/* Contact Button */}
          {user && user.id !== item.seller._id && (
            <button
              onClick={handleContact}
              className="btn btn-primary w-full"
            >
              Contact Seller
            </button>
          )}

          {/* Show message if viewer is the seller */}
          {user && user.id === item.seller._id && (
            <div className="text-gray-600 text-center p-4 bg-gray-100 rounded">
              This is your listing
            </div>
          )}
          {/* this is payment section */}
          {user && user.id !== item.seller._id && <>
            <button
            onClick={() => setShowPayment(true)}
            className="btn btn-primary w-full"
          >
            Buy Now - ${item.price}
          </button>

          <PaymentModal
            isOpen={showPayment}
            onClose={() => setShowPayment(false)}
            amount={item.price}
            itemId={item._id}
            onSuccess={handlePaymentSuccess}
          />
          </>}
          {/* end of the payment section */}
          {/* Show login prompt if not logged in */}
          {!user && (
            <div className="text-center space-y-2">
              <p className="text-gray-600">Login to contact the seller</p>
              <button
                onClick={() => navigate('/login')}
                className="btn btn-primary"
              >
                Login
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemDetails;