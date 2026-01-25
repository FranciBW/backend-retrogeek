import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../db/pool.js";

export async function register(req, res) {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ error: "Faltan datos" });
  }

  const password_hash = await bcrypt.hash(password, 10);

  try {
    const result = await pool.query(
      `INSERT INTO users (first_name, last_name, email, password_hash)
       VALUES ($1,$2,$3,$4)
       RETURNING id, email`,
      [firstName, lastName, email, password_hash]
    );

    const user = result.rows[0];
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(201).json({ token, email: user.email });
  } catch {
    return res.status(409).json({ error: "Correo ya registrado" });
  }
}

export async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Faltan credenciales" });
  }

  const result = await pool.query(
    `SELECT id, email, password_hash FROM users WHERE email=$1`,
    [email]
  );

  const user = result.rows[0];
  if (!user) return res.status(401).json({ error: "Credenciales inválidas" });

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.status(401).json({ error: "Credenciales inválidas" });

  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return res.json({ token, email: user.email });
}

export async function me(req, res) {
  const result = await pool.query(
    `SELECT id, first_name, last_name, email, created_at
     FROM users WHERE id=$1`,
    [req.user.id]
  );

  return res.json(result.rows[0]);
}