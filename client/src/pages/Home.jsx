// src/pages/Home.jsx
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useItems } from '../contexts/ItemContext';
import ItemCard from '../components/ItemCard';
import SearchBar from '../components/SearchBar';
import { FaPlus } from 'react-icons/fa';

const Home = () => {
  const { items, loading, getAllItems } = useItems();

  useEffect(() => {
    getAllItems();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Available Items</h1>
        <Link to="/create-item" className="btn btn-primary flex items-center gap-2">
          <FaPlus /> New Item
        </Link>
      </div>

      <SearchBar />

      {loading ? (
        <div className="text-center mt-10">Loading...</div>
      ) : items.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">
          No items found. Try adjusting your filters!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <ItemCard key={item._id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;