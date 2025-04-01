import Stripe from 'stripe';
import DatabaseService from '../services/DatabaseService';

// Initialize Stripe with the secret key
const stripe = new Stripe(process.env.VITE_STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function createPaymentIntent(courseId: string, userId: string) {
  try {
    // For testing, we'll use a fixed course price
    const amount = 8999; // $89.99 in cents

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      metadata: {
        courseId,
        userId,
      },
    });

    return {
      clientSecret: paymentIntent.client_secret,
    };
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
}

export async function handleWebhook(event: Stripe.Event) {
  try {
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const { courseId, userId } = paymentIntent.metadata;

        // Update user's purchased courses
        console.log(`Payment succeeded for course ${courseId} by user ${userId}`);
        break;
      }

      case 'payment_intent.payment_failed': {
        // Handle failed payment
        console.log('Payment failed:', event.data.object);
        break;
      }
    }

    return { received: true };
  } catch (error) {
    console.error('Error handling webhook:', error);
    throw error;
  }
}

export async function getCourses() {
  try {
    // For testing, return a dummy course
    return [{
      id: '1',
      title: 'Test Course',
      description: 'A test course for payment integration',
      price: 89.99,
      image: ''
    }];
  } catch (error) {
    console.error('Error fetching courses:', error);
    throw error;
  }
} 