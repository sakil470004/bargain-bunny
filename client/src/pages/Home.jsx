import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useItems } from '../contexts/ItemContext';
import ItemCard from '../components/ItemCard';
import SearchBar from '../components/SearchBar';
import { Plus, Package, Filter } from 'lucide-react';
// we drop the project because we don't have the backend yet to support the project. We will continue the project once we have the backend ready. and We don't have notification and location search future is not build on demo. This project main focus is to build the demo so that We can do that on large scale later.
const Home = () => {
  const { items, loading, getAllItems } = useItems();

  useEffect(() => {
    getAllItems();
  }, []);

  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((n) => (
        <div key={n} className="bg-white rounded-xl p-4 space-y-4 animate-pulse">
          <div className="w-full h-48 bg-gray-200 rounded-lg"></div>
          <div className="w-2/3 h-4 bg-gray-200 rounded"></div>
          <div className="w-1/3 h-4 bg-gray-200 rounded"></div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Hero Section */}
        <div className="bg-white rounded-xl p-8 mb-8 border border-gray-100">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Discover Amazing Deals
            </h1>
            <p className="text-lg text-gray-500 mb-6">
              Find unique items from sellers in your local area
            </p>
            <SearchBar className="mb-4" />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-gray-900">Available Items</h2>
            {!loading && items.length > 0 && (
              <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {items.length} items
              </span>
            )}
          </div>
          <div className="flex gap-3">
            <button className="flex items-center px-4 py-2 text-gray-700 bg-white border 
                           border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </button>
            <Link 
              to="/create-item" 
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg 
                       hover:bg-blue-700 transition-colors duration-200"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Item
            </Link>
          </div>
        </div>

        {loading ? (
          <LoadingSkeleton />
        ) : items.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center border border-gray-100">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Items Found</h3>
            <p className="text-gray-500 mb-6">
              We couldn't find any items matching your criteria
            </p>
            <button 
              onClick={() => getAllItems()}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <div key={item._id} className="transition-transform duration-200 hover:-translate-y-1">
                <ItemCard item={item} />
              </div>
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        {items.length > 0 && (
          <div className="mt-12 text-center">
            <button className="text-gray-500 hover:text-gray-600 font-medium">
              Load More Items
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;