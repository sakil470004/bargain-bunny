import { useState, useEffect, useCallback } from 'react';
import { FaMapMarkerAlt, FaSpinner } from 'react-icons/fa';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import toast from 'react-hot-toast';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

// Simple debounce function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

const LocationInput = ({ onLocationSelect, initialValue = '' }) => {
  const [address, setAddress] = useState(initialValue);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialValue) {
      setAddress(initialValue);
    }
  }, [initialValue]);

  const searchLocation = async (query) => {
    if (!query || query.length < 3) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=${mapboxgl.accessToken}&country=US&types=address,place,locality,neighborhood`
      );
      
      if (!response.ok) {
        throw new Error('Location search failed');
      }
      
      const data = await response.json();
      setSuggestions(data.features);
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Error searching location. Please try again.');
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  // Create debounced search function
  const debouncedSearch = useCallback(
    debounce((query) => searchLocation(query), 300),
    []
  );

  const handleSelect = (suggestion) => {
    const [longitude, latitude] = suggestion.center;
    
    // Extract location components
    const context = suggestion.context || [];
    const locationData = {
      coordinates: [longitude, latitude],
      address: suggestion.place_name,
      city: context.find(c => c.id.startsWith('place'))?.text || '',
      state: context.find(c => c.id.startsWith('region'))?.text || '',
      country: context.find(c => c.id.startsWith('country'))?.text || 'United States'
    };

    setAddress(suggestion.place_name);
    setSuggestions([]);
    onLocationSelect(locationData);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setAddress(value);
    
    if (value.length >= 3) {
      debouncedSearch(value);
    } else {
      setSuggestions([]);
    }
  };

  // Clear suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setSuggestions([]);
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" onClick={(e) => e.stopPropagation()}>
      <div className="relative">
        <FaMapMarkerAlt className="absolute left-3 top-3 text-gray-400" />
        <input
          type="text"
          value={address}
          onChange={handleInputChange}
          placeholder="Enter location"
          className="input pl-10 w-full"
          required
        />
        {loading && (
          <div className="absolute right-3 top-3">
            <FaSpinner className="animate-spin text-gray-400" />
          </div>
        )}
      </div>

      {/* Location Suggestions */}
      {suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((suggestion) => (
            <div
              key={suggestion.id}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelect(suggestion)}
            >
              <div className="font-medium">{suggestion.text}</div>
              <div className="text-sm text-gray-500">{suggestion.place_name}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationInput;