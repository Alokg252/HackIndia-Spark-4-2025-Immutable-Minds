import express, { Request, Response } from 'express';
import { createPaymentIntent } from '../api/payment';

const app = express();
app.use(express.json());

app.post('/api/create-payment-intent', async (req: Request, res: Response) => {
  try {
    const { courseId } = req.body;
    const userId = 'test-user-123'; // For testing purposes
    const result = await createPaymentIntent(courseId, userId);
    res.json(result);
  } catch (error: any) {
    console.error('API Error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default app; 