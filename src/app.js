import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import productsRoutes from "./routes/products.routes.js";

export const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL, // ej: https://retrogeek.netlify.app
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // permite requests sin origin (postman/thunder)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("CORS bloqueado"), false);
    },
  })
);

app.use(express.json());

app.get("/", (_req, res) => res.json({ ok: true, name: "RetroGeek API" }));
app.get("/health", (_req, res) => res.json({ ok: true }));
app.use("/api/auth", authRoutes);
app.use("/api/products", productsRoutes);