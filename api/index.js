// api/index.js - Point d'entrée Vercel
import cors from "cors";
import "dotenv/config";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import mongoose from "mongoose";

import { testCloudinaryConnection } from "../backend/config/cloudinaryConfig.js";
import config from "../backend/config/index.js";
import { localeMiddleware } from "../backend/middlewares/localeMiddleware.js";

// Swagger Setup
import swaggerDocs from "../backend/swagger.js";

// Routes
import authRoutes from "../backend/routes/authRoutes.js";

const app = express();

// Trust proxy - Required for Vercel
app.set("trust proxy", 1);

// ==================== MIDDLEWARES ====================
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https:", "res.cloudinary.com"],
        scriptSrc: ["'self'"],
        connectSrc: [
          "'self'",
          "https://api.resend.com",
          "https://api.brevo.com",
        ],
      },
    },
  }),
);

app.use(
  cors({
    origin: config.cors.allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(localeMiddleware);

// ==================== RATE LIMITING ====================
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later.",
    data: null,
  },
});
app.use("/api/", limiter);

// ==================== API ROUTES ====================
app.use("/api/auth", authRoutes);

// ==================== HEALTH & WELCOME ====================
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    service: "Djulah API",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
    environment: config.env,
  });
});

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🎉 Bienvenue sur l'API Djulah Restaurant Management",
    version: "1.0.0",
    environment: config.env,
    documentation: "/api-docs",
    healthCheck: "/health",
  });
});

// ==================== SWAGGER DOCS ====================
swaggerDocs(app);

// ==================== ERROR HANDLING ====================
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    data: null,
    ...(config.env === "development" && { stack: err.stack }),
  });
});

// ==================== DATABASE CONNECTION ====================
// Connect to MongoDB only if not already connected
if (mongoose.connection.readyState === 0) {
  mongoose
    .connect(config.db.mongoUri)
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => {
      console.error("MongoDB connection error:", err.message);
    });
}

// ==================== CLOUDINARY CONNECTION TEST ====================
const testCloudinary = async () => {
  try {
    const result = await testCloudinaryConnection();
    if (result.success) {
      console.log("🌐 Cloudinary prêt pour les uploads d'images");
    } else {
      console.log(
        "⚠️ Cloudinary non disponible - Les uploads d'images échoueront",
      );
    }
  } catch (error) {
    console.log("❌ Erreur test Cloudinary:", error.message);
  }
};

testCloudinary();

export default app;
