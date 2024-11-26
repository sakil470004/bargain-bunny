import { createContext, useContext, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../utils/api';

const ItemContext = createContext(null);

export const ItemProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    condition: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'newest'
  });

  const getAllItems = async () => {
    try {
      setLoading(true);
      // Add query parameters based on filters
      const queryParams = new URLSearchParams();
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.condition) queryParams.append('condition', filters.condition);
      if (filters.minPrice) queryParams.append('minPrice', filters.minPrice);
      if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice);
      if (filters.sortBy) queryParams.append('sortBy', filters.sortBy);

      const response = await api.get(`/items?${queryParams}`);
      setItems(response.data);
    } catch (error) {
      toast.error('Failed to fetch items');
    } finally {
      setLoading(false);
    }
  };

  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const createItem = async (itemData) => {
    try {
      const response = await api.post('/items', itemData);
      setItems([response.data, ...items]);
      toast.success('Item created successfully!');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create item');
      throw error;
    }
  };

  const getUserItems = async () => {
    try {
      setLoading(true);
      const response = await api.get('/items/user/items');
      return response.data;
    } catch (error) {
      toast.error('Failed to fetch your items');
      return [];
    } finally {
      setLoading(false);
    }
  };

  return (
    <ItemContext.Provider value={{ 
      items, 
      loading, 
      filters,
      getAllItems, 
      updateFilters,
      createItem,
      getUserItems 
    }}>
      {children}
    </ItemContext.Provider>
  );
};

export const useItems = () => useContext(ItemContext);