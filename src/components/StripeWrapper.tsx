import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PaymentModal from './PaymentModal';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

console.log('Stripe public key:', import.meta.env.VITE_STRIPE_PUBLIC_KEY);

interface StripeWrapperProps {
  course: {
    id: string;
    title: string;
    description: string;
    price: number;
    image: string;
  };
  onClose: () => void;
  onSuccess: () => void;
}

const StripeWrapper: React.FC<StripeWrapperProps> = ({ course, onClose, onSuccess }) => {
  console.log('StripeWrapper rendered for course:', course.title);
  
  return (
    <Elements stripe={stripePromise}>
      <PaymentModal course={course} onClose={onClose} onSuccess={onSuccess} />
    </Elements>
  );
};

export default StripeWrapper; 