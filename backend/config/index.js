import "dotenv/config";

const parseCsv = (value) => {
  if (!value) return [];
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
};

const isProd = (process.env.NODE_ENV || "development") === "production";

const required = (name) => {
  const v = process.env[name];
  if (!v) {
    if (isProd && name !== "MONGODB_URI") {
      throw new Error(`Missing required env var: ${name}`);
    }
  }
  return v;
};

const port = Number(process.env.PORT || 5000);

const renderExternalUrl = process.env.RENDER_EXTERNAL_URL;
const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";

const defaultProdBaseUrl = "https://djulah-backend.onrender.com";

const publicBaseUrl = renderExternalUrl
  ? renderExternalUrl
  : isProd
    ? defaultProdBaseUrl
    : `http://localhost:${port}`;

const allowedOrigins = [
  clientUrl,
  defaultProdBaseUrl,
  "https://api.klarity.cm",
  "http://localhost:5000",
  "http://localhost:5001",
  "http://localhost:3000",
  "http://localhost:3001",
  "http://127.0.0.1:5000",
  "http://127.0.0.1:3000",
  renderExternalUrl,
  ...parseCsv(process.env.ALLOWED_ORIGINS),
].filter(Boolean);

const config = {
  env: process.env.NODE_ENV || "development",
  isProd,
  port,
  publicBaseUrl,

  db: {
    mongoUri: process.env.MONGODB_URI || required("MONGODB_URI"),
  },

  jwt: {
    secret: required("JWT_SECRET"),
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  },

  cors: {
    allowedOrigins,
    allowAllInDev: !isProd,
  },

  client: {
    url: clientUrl,
  },

  email: {
    resendApiKey: process.env.RESEND_API_KEY,
    brevoApiKey: process.env.BREVO_API_KEY,
    from: process.env.EMAIL_FROM || "onboarding@resend.dev",
    brevoEmail: process.env.BREVO_EMAIL,
  },

  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },
};

export default config;
