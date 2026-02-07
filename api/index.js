import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import mongoose from "mongoose";

// Charger env vars
dotenv.config({ path: "./backend/.env" }); // ou juste dotenv.config() si env vars dans Vercel

// Import routes (ajustez les chemins)
import authRoutes from "../backend/routes/authRoutes.js";

const app = express();

// Trust proxy
app.set("trust proxy", 1);

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: "*", // À restreindre en production
    credentials: true,
  }),
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use("/api/auth", limiter);

// Connexion MongoDB (lazy)
let isConnected = false;
async function connectDB() {
  if (isConnected) return;
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    isConnected = true;
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB error:", err.message);
  }
}

// Routes
app.use("/api/auth", authRoutes);

// Health check
app.get("/api/health", async (req, res) => {
  await connectDB();
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// 404
app.use((req, res) => {
  res
    .status(404)
    .json({ success: false, message: "Not found", path: req.originalUrl });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: err.message });
});

// Export handler pour Vercel
export default async function handler(req, res) {
  await connectDB();
  return app(req, res);
}
