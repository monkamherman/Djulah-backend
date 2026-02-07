import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import mongoose from "mongoose";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

// Résoudre les chemins correctement
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Charger les variables d'environnement
dotenv.config({ path: join(__dirname, ".env") });

// Imports depuis le même dossier backend
import authRoutes from "../routes/authRoutes.js";

const app = express();

// Configuration Express
app.set("trust proxy", 1);

// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  }),
);

app.use(
  cors({
    origin: "*",
    credentials: true,
  }),
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: "Too many requests" },
});
app.use("/api/auth", limiter);

// Connexion MongoDB (avec cache pour serverless)
let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
    };
    cached.promise = mongoose.connect(process.env.MONGODB_URI, opts);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

// Routes
app.use("/api/auth", authRoutes);

// Health check
app.get("/api/health", async (req, res) => {
  try {
    await connectDB();
    res.json({
      status: "OK",
      service: "Djulah API",
      timestamp: new Date().toISOString(),
      db: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    });
  } catch (err) {
    res.status(500).json({ status: "ERROR", message: err.message });
  }
});

// Root
app.get("/api", (req, res) => {
  res.json({
    message: "Djulah API",
    version: "1.0.0",
    endpoints: ["/api/health", "/api/auth"],
  });
});

// 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.originalUrl,
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// Handler Vercel
export default async function handler(req, res) {
  try {
    await connectDB();
    return app(req, res);
  } catch (err) {
    console.error("Handler error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
}
