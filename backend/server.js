// server.js → 100% READY FOR DJULAH (November 19, 2025)
import cors from "cors";
import "dotenv/config";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import mongoose from "mongoose";

import { testCloudinaryConnection } from "./config/cloudinaryConfig.js";
import config from "./config/index.js";
import { localeMiddleware } from "./middlewares/localeMiddleware.js";

// Swagger Setup
import swaggerDocs from "./swagger.js"; // ← This activates /api-docs

// Routes
import authRoutes from "./routes/authRoutes.js";

const app = express();

// Trust proxy - Required for Render, Heroku, and other reverse proxies
// This allows Express to trust the X-Forwarded-* headers
app.set("trust proxy", 1);

// ==================== SECURITY & MIDDLEWARE ====================
// Helmet configuration - Swagger-friendly
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
        scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
        imgSrc: ["'self'", "data:", "https://validator.swagger.io"],
        connectSrc: ["'self'"],
      },
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);

// CORS CONFIGURATION - Development & Production friendly
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (config.cors.allowAllInDev) {
      console.log(`✅ CORS allowed (dev mode): ${origin}`);
      return callback(null, true);
    }

    if (config.cors.allowedOrigins.indexOf(origin) !== -1) {
      console.log(`✅ CORS allowed (whitelisted): ${origin}`);
      callback(null, true);
    } else {
      console.warn(`⚠️  CORS rejected origin: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin",
    "Accept-Language",
    "Time-Zone",
  ],
  exposedHeaders: ["Content-Range", "X-Content-Range"],
  maxAge: 86400,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(localeMiddleware);

// Rate limiting (especially for auth)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { success: false, message: "Too many requests from this IP" },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api/auth", limiter);

// Body parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ==================== DATABASE CONNECTION ====================
mongoose
  .connect(config.db.mongoUri)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });

// ==================== CLOUDINARY CONNECTION TEST ====================
// Test de connexion Cloudinary au démarrage
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

// ==================== API ROUTES ====================
app.use("/api/auth", authRoutes);

// ==================== HEALTH & WELCOME ====================
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    service: "Djulah API",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.get("/", (req, res) => {
  const baseUrl = config.publicBaseUrl;
  res.json({
    message: "Welcome to Djulah API",
    version: "1.0.0",
    environment: config.env,
    docs: `${baseUrl}/api-docs`,
    health: `${baseUrl}/health`,
  });
});

// ==================== SWAGGER UI ====================
// This activates the beautiful interactive docs
swaggerDocs(app); // ← This line gives you /api-docs

// ==================== 404 & ERROR HANDLING ====================
// 404 — Route not found
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    data: null,
    path: req.originalUrl,
    method: req.method,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    data: null,
    ...(config.env === "development" && { stack: err.stack }),
  });
});

// ==================== START SERVER ====================
const PORT = config.port;

app.listen(PORT, () => {
  console.log("Djulah API Running");
  console.log(`Local: http://localhost:${PORT}`);
  console.log(`Swagger Docs: http://localhost:${PORT}/api-docs`);
  console.log(`Health Check: http://localhost:${PORT}/health`);
});

export default app;
