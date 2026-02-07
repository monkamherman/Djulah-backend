// api/index.js - Point d'entrée Vercel
import cors from "cors";
import "dotenv/config";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import mongoose from "mongoose";

import config from "../backend/config/index.js";
import { localeMiddleware } from "../backend/middlewares/localeMiddleware.js";
import authRoutes from "../backend/routes/authRoutes.js";
import swaggerDocs from "../backend/swagger.js";

const app = express();

// Trust proxy
app.set("trust proxy", 1);

// Security & Middleware
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

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (
      config.cors.allowAllInDev ||
      config.cors.allowedOrigins.includes(origin)
    ) {
      return callback(null, true);
    }
    callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin",
  ],
};

app.use(cors(corsOptions));
app.use(localeMiddleware);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: "Too many requests" },
});
app.use("/api/auth", limiter);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Database (connexion lazy)
let isConnected = false;
const connectDB = async () => {
  if (isConnected) return;
  await mongoose.connect(config.db.mongoUri);
  isConnected = true;
  console.log("MongoDB Connected");
};

// Routes
app.use("/api/auth", authRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    service: "Djulah API",
    timestamp: new Date().toISOString(),
  });
});

// Welcome
app.get("/api", (req, res) => {
  res.json({ message: "Welcome to Djulah API", version: "1.0.0" });
});

// Swagger
swaggerDocs(app);

// 404
app.use((req, res) => {
  res
    .status(404)
    .json({
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

// Export for Vercel (PAS de app.listen!)
export default async function handler(req, res) {
  await connectDB();
  return app(req, res);
}
