import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import mongoose from "mongoose";
import { dirname } from "path";
import { fileURLToPath } from "url";

// Résoudre les chemins correctement
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Charger les variables d'environnement
dotenv.config({ path: "./.env" });

// Import des routes d'authentification
import authRoutes from "../routes/authRoutes.js";

// Version avec imports progressifs
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
    origin: process.env.CLIENT_URL || "*",
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
let isConnected = false;
async function connectDB() {
  if (isConnected) return;
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    isConnected = true;
    console.log("✅ MongoDB Connecté - Production");
  } catch (err) {
    console.error("❌ Erreur connexion MongoDB:", err.message);
    throw err;
  }
}

// Test connexion Cloudinary
function testCloudinary() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;

  if (cloudName && apiKey) {
    console.log("✅ Cloudinary configuré - Production");
    console.log(`📸 Cloud: ${cloudName}`);
    console.log(`🔑 API Key: ${apiKey.substring(0, 8)}...`);
  } else {
    console.log("⚠️ Cloudinary non configuré");
  }
}

// Routes d'authentification
app.use("/api/auth", authRoutes);

// Health check
app.get("/api/health", async (req, res) => {
  try {
    await connectDB();
    testCloudinary();

    res.json({
      status: "OK",
      service: "Djulah API",
      timestamp: new Date().toISOString(),
      version: "1.0.0",
      message: "API Production - MongoDB + Cloudinary + Auth",
      features: [
        "express",
        "cors",
        "helmet",
        "rate-limit",
        "mongoose",
        "cloudinary",
      ],
      db: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
      cloudinary: process.env.CLOUDINARY_CLOUD_NAME
        ? "configured"
        : "not configured",
      method: req.method,
      url: req.url,
      environment: "production",
    });
  } catch (err) {
    res.status(500).json({
      status: "ERROR",
      message: err.message,
    });
  }
});

// Root endpoint
app.get("/api", (req, res) => {
  res.json({
    message: "Djulah API - Production",
    version: "1.0.0",
    endpoints: ["/api/health", "/api/auth"],
    status: "operational",
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.originalUrl,
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("💥 Error:", err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

export default async function handler(req, res) {
  try {
    console.log("🚀 Handler appelé:", req.method, req.url);
    await connectDB();
    return app(req, res);
  } catch (err) {
    console.error("💥 Handler error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
}
