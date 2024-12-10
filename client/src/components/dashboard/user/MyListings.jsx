// client/src/components/dashboard/user/MyListings.jsx
import React, { useEffect } from 'react';
import { useDashboard } from '../../../contexts/DashboardContext';

const MyListings = () => {
  const { 
    loading, 
    error, 
    listings, 
    fetchListings 
  } = useDashboard();

  useEffect(() => {
    fetchListings();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-medium">My Listings</h2>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">
            Add New Listing
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {listings.map((listing) => (
                <tr key={listing._id}>
                  <td className="px-6 py-4">{listing.title}</td>
                  <td className="px-6 py-4">${listing.price}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      listing.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {listing.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-blue-500 hover:text-blue-700 mr-2">
                      Edit
                    </button>
                    <button className="text-red-500 hover:text-red-700">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MyListings;