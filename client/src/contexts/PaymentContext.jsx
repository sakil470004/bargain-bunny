import { createContext, useContext } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import api from '../utils/api';
import toast from 'react-hot-toast';

const PaymentContext = createContext(null);

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export const PaymentProvider = ({ children }) => {
  const initiatePayment = async (amount, itemId) => {
    try {
      // Get payment intent
      const { data } = await api.post('/payment/create-payment-intent', { 
        amount 
      });

      const stripe = await stripePromise;
      
      // Initiate payment
      const { error } = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: 'Test User',
          },
        },
      });

      if (error) {
        toast.error(error.message);
        return false;
      }

      toast.success('Payment successful!');
      return true;
    } catch (error) {
      toast.error('Payment failed');
      return false;
    }
  };

  return (
    <PaymentContext.Provider value={{ initiatePayment }}>
      {children}
    </PaymentContext.Provider>
  );
};

export const usePayment = () => useContext(PaymentContext);