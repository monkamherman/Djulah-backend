// api/index.js - Version ultra-simple pour test
export default function handler(req, res) {
  res.status(200).json({
    status: "OK",
    service: "Djulah API",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
    message: "Test simple Vercel",
  });
}
