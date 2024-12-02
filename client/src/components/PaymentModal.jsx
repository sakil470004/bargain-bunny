import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PaymentForm from './PaymentForm';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const PaymentModal = ({ amount, itemId, isOpen, onClose, onSuccess }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Complete Payment</h2>
        <Elements stripe={stripePromise}>
          <PaymentForm 
            amount={amount} 
            itemId={itemId} 
            onSuccess={() => {
              onSuccess();
              onClose();
            }} 
          />
        </Elements>
        <button onClick={onClose} className="mt-4 w-full btn bg-gray-200 hover:bg-gray-300">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default PaymentModal;