import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import productsRoutes from "./routes/products.routes.js";

export const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.get("/", (_req, res) => res.json({ ok: true, name: "RetroGeek API" }));

app.use("/api/auth", authRoutes);
app.use("/api/products", productsRoutes);