import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { useState } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const PaymentForm = ({ amount, itemId, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) return;
    
    setLoading(true);
    try {
      const { data } = await api.post('/payment/create-payment-intent', { amount });
      const { error } = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: { name: 'Test User' }
        }
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Payment successful!');
        onSuccess();
      }
    } catch (error) {
      toast.error('Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-4 border rounded-lg">
        <CardElement />
      </div>
      
      <button
        type="submit"
        disabled={!stripe || loading}
        className={`btn btn-primary w-full ${loading ? 'opacity-50' : ''}`}
      >
        {loading ? 'Processing...' : `Pay $${amount}`}
      </button>
    </form>
  );
};

export default PaymentForm;