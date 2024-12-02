import { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const { data } = await api.get('/payment/transactions');
      setTransactions(data);
    } catch (error) {
      toast.error('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Transaction History</h2>
      
      <div className="space-y-4">
        {transactions.map(transaction => (
          <div key={transaction._id} 
               className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{transaction.item.title}</h3>
                <p className="text-green-600 font-bold">${transaction.amount}</p>
                <p className="text-sm text-gray-500">
                  {new Date(transaction.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className={`text-sm ${
                  user.id === transaction.buyer._id ? 'text-red-500' : 'text-green-500'
                }`}>
                  {user.id === transaction.buyer._id ? 'Bought' : 'Sold'}
                </p>
                <p className="text-sm text-gray-600">
                  {user.id === transaction.buyer._id 
                    ? `From: ${transaction.seller.username}`
                    : `To: ${transaction.buyer.username}`}
                </p>
              </div>
            </div>
          </div>
        ))}
        
        {transactions.length === 0 && (
          <div className="text-center text-gray-500">
            No transactions found
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;