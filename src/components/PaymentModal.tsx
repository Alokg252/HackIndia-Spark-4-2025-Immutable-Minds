import React, { useState, useEffect } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import StripeService, { Course } from '../services/StripeService';
import WalletService, { WalletBalance } from '../services/WalletService';
import UserCourseService from '../services/UserCourseService';
import { InjectedConnector } from '@web3-react/injected-connector';

interface PaymentModalProps {
  course: Course;
  onClose: () => void;
  onSuccess: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ course, onClose, onSuccess }) => {
  console.log('PaymentModal rendered for course:', course);
  
  const stripe = useStripe();
  const elements = useElements();
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'wallet'>('stripe');
  const [walletBalance, setWalletBalance] = useState<WalletBalance | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConnectingWallet, setIsConnectingWallet] = useState(false);

  const stripeService = StripeService.getInstance();
  const walletService = WalletService.getInstance();
  const userCourseService = UserCourseService.getInstance();

  // Initialize wallet connection when component mounts
  useEffect(() => {
    let isMounted = true;

    const initializeWallet = async () => {
      try {
        setIsConnectingWallet(true);
        const connector = new InjectedConnector({
          supportedChainIds: [1, 3, 4, 5, 42, 31337],
        });
        
        // Check if already connected
        const isConnected = await walletService.isConnected();
        if (!isConnected) {
          await walletService.connect(connector);
        }
        
        if (isMounted) {
          const balance = await walletService.getBalance();
          setWalletBalance(balance);
        }
      } catch (error) {
        console.error('Error initializing wallet:', error);
        if (isMounted) {
          setError('Failed to connect wallet. Please try again.');
        }
      } finally {
        if (isMounted) {
          setIsConnectingWallet(false);
        }
      }
    };

    initializeWallet();

    return () => {
      isMounted = false;
    };
  }, []);

  const handlePaymentSuccess = () => {
    try {
      // Get the user's wallet address
      const userAddress = localStorage.getItem('walletAddress');
      if (!userAddress) {
        setError('Wallet address not found. Please reconnect your wallet.');
        return;
      }

      // Add the course to user's courses
      userCourseService.addCourse(parseInt(course.id), userAddress);

      // Show success message
      console.log('Course added to My Courses:', course.title);
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error adding course to My Courses:', error);
      setError('Payment successful but failed to add course. Please contact support.');
    }
  };

  const handleStripePayment = async () => {
    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement)!,
      });

      if (stripeError) {
        throw new Error(stripeError.message);
      }

      const { clientSecret } = await stripeService.createPaymentIntent(course.id);
      await stripeService.confirmPayment(clientSecret);
      handlePaymentSuccess();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Payment failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleWalletPayment = async () => {
    if (!walletBalance) {
      setError('Wallet not connected');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Convert course price to ETH with proper decimal handling
      const ethAmount = (course.price / walletBalance.usd).toFixed(18); // Fix to 18 decimals (standard for ETH)
      console.log('Course price in USD:', course.price);
      console.log('ETH/USD rate:', walletBalance.usd);
      console.log('ETH amount to send:', ethAmount);
      
      // Send transaction to the course payment address
      await walletService.sendTransaction(
        '0x70997970C51812dc3A010C7d01b50e0d17dc79C8', // Course payment address
        ethAmount
      );
      
      handlePaymentSuccess();
    } catch (error) {
      console.error('Payment error:', error);
      setError(error instanceof Error ? error.message : 'Payment failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Purchase Course</h2>
        
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">{course.title}</h3>
          <p className="text-gray-600 mb-4">{course.description}</p>
          <p className="text-xl font-bold">${course.price}</p>
        </div>

        <div className="mb-6">
          <div className="flex gap-4 mb-4">
            <button
              className={`flex-1 py-2 px-4 rounded ${
                paymentMethod === 'stripe'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
              onClick={() => setPaymentMethod('stripe')}
            >
              Credit Card
            </button>
            <button
              className={`flex-1 py-2 px-4 rounded ${
                paymentMethod === 'wallet'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
              onClick={() => setPaymentMethod('wallet')}
            >
              Wallet
            </button>
          </div>

          {paymentMethod === 'stripe' ? (
            <div className="border rounded p-4">
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: '16px',
                      color: '#424770',
                      '::placeholder': {
                        color: '#aab7c4',
                      },
                    },
                    invalid: {
                      color: '#9e2146',
                    },
                  },
                }}
              />
            </div>
          ) : (
            <div className="border rounded p-4">
              {isConnectingWallet ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                  <span className="text-gray-600">Connecting wallet...</span>
                </div>
              ) : walletBalance ? (
                <div>
                  <p className="text-sm text-gray-600">Wallet Balance:</p>
                  <p className="text-lg font-semibold">
                    {walletBalance.eth} ETH (${walletBalance.usd.toFixed(2)})
                  </p>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-red-600 mb-2">Failed to connect wallet</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Try Again
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {error && (
          <div className="text-red-600 mb-4">{error}</div>
        )}

        <div className="flex gap-4">
          <button
            className="flex-1 py-2 px-4 bg-gray-200 text-gray-700 rounded"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            className="flex-1 py-2 px-4 bg-blue-600 text-white rounded"
            onClick={paymentMethod === 'stripe' ? handleStripePayment : handleWalletPayment}
            disabled={isLoading || (paymentMethod === 'wallet' && !walletBalance)}
          >
            {isLoading ? 'Processing...' : 'Pay Now'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal; 