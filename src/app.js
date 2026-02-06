import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import productsRoutes from "./routes/products.routes.js";

export const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL, // https://desafio-retrogeek.vercel.app
].filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);

    const ok =
      allowedOrigins.includes(origin) ||
      /^https:\/\/.*\.vercel\.app$/.test(origin);

    cb(ok ? null : new Error("CORS bloqueado"), ok);
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use((req, res, next) => {
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

app.use(express.json());

app.get("/", (_req, res) =>
  res.json({ ok: true, name: "RetroGeek API" })
);

app.get("/health", (_req, res) =>
  res.json({ ok: true })
);

app.use("/api/auth", authRoutes);
app.use("/api/products", productsRoutes);
app.get("/db-test", async (_req, res) => {
  try {
    const { pool } = await import("./db.js"); // o donde tengas tu pool
    const r = await pool.query("SELECT NOW() as now");
    res.json({ ok: true, now: r.rows[0].now });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});
