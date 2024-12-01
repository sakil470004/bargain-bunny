import { useState, useEffect } from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import toast from 'react-hot-toast';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const LocationInput = ({ onLocationSelect }) => {
  const [address, setAddress] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchLocation = async (query) => {
    if (!query) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=${mapboxgl.accessToken}&country=US`
      );
      const data = await response.json();
      setSuggestions(data.features);
    } catch (error) {
      toast.error('Error searching location');
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (suggestion) => {
    const [longitude, latitude] = suggestion.center;
    const locationData = {
      coordinates: [longitude, latitude],
      address: suggestion.place_name,
      city: suggestion.context?.find(c => c.id.startsWith('place'))?.text,
      state: suggestion.context?.find(c => c.id.startsWith('region'))?.text,
      country: suggestion.context?.find(c => c.id.startsWith('country'))?.text
    };

    setAddress(suggestion.place_name);
    setSuggestions([]);
    onLocationSelect(locationData);
  };

  return (
    <div className="relative">
      <div className="relative">
        <FaMapMarkerAlt className="absolute left-3 top-3 text-gray-400" />
        <input
          type="text"
          value={address}
          onChange={(e) => {
            setAddress(e.target.value);
            searchLocation(e.target.value);
          }}
          placeholder="Enter location"
          className="input pl-10 w-full"
          required
        />
      </div>

      {/* Location Suggestions */}
      {suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg">
          {suggestions.map((suggestion) => (
            <div
              key={suggestion.id}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelect(suggestion)}
            >
              {suggestion.place_name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationInput;