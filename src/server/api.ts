import express from "express";
import authRoutes from "./routes/authRoutes";
import { createPaymentIntent } from "../api/payment";
import cors from "cors";
const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:5174", credentials: true }));
// **Authentication Routes**
app.use("/api", authRoutes);

// **Payment API**
app.post("/api/create-payment-intent", async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = "test-user-123"; // For testing
    const result = await createPaymentIntent(courseId, userId);
    res.json(result);
  } catch (error: any) {
    console.error("API Error:", error);
    res.status(500).json({ error: error.message });
  }
});

export default app;
