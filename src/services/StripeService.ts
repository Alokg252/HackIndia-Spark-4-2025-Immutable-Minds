import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
}

export interface PaymentIntent {
  clientSecret: string;
  courseId: string;
}

class StripeService {
  private static instance: StripeService;
  private stripe: any;

  private constructor() {
    // Initialize Stripe when the service is created
    this.initialize();
  }

  public static getInstance(): StripeService {
    if (!StripeService.instance) {
      StripeService.instance = new StripeService();
    }
    return StripeService.instance;
  }

  private async initialize() {
    try {
      this.stripe = await stripePromise;
      console.log('Stripe initialized with public key:', import.meta.env.VITE_STRIPE_PUBLIC_KEY);
    } catch (error) {
      console.error('Failed to initialize Stripe:', error);
      throw error;
    }
  }

  public async createPaymentIntent(courseId: string): Promise<PaymentIntent> {
    try {
      if (!this.stripe) {
        await this.initialize();
      }

      console.log('Creating payment intent for course:', courseId);
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ courseId }),
      });

      console.log('Payment intent response status:', response.status);
      const responseText = await response.text();
      console.log('Payment intent response:', responseText);

      if (!response.ok) {
        throw new Error(`Failed to create payment intent: ${responseText}`);
      }

      return JSON.parse(responseText);
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw error;
    }
  }

  public async confirmPayment(clientSecret: string) {
    try {
      if (!this.stripe) {
        await this.initialize();
      }

      console.log('Confirming payment with client secret');
      const { error } = await this.stripe.confirmCardPayment(clientSecret);
      if (error) {
        console.error('Payment confirmation error:', error);
        throw error;
      }
      console.log('Payment confirmed successfully');
    } catch (error) {
      console.error('Error confirming payment:', error);
      throw error;
    }
  }

  public async getCourses(): Promise<Course[]> {
    try {
      const response = await fetch('/api/courses');
      if (!response.ok) {
        throw new Error('Failed to fetch courses');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching courses:', error);
      throw error;
    }
  }
}

export default StripeService; 