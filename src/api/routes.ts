import { createPaymentIntent } from './payment';

export async function handleApiRequest(path: string, method: string, body: any) {
  switch (path) {
    case '/api/create-payment-intent':
      if (method === 'POST') {
        const { courseId } = body;
        // For testing, we'll use a dummy userId
        const userId = 'test-user-123';
        return await createPaymentIntent(courseId, userId);
      }
      throw new Error('Method not allowed');
    
    default:
      throw new Error('Not found');
  }
} 