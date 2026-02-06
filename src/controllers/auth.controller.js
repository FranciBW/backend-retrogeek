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
       RETURNING id, first_name, last_name, email, created_at`,
      [firstName, lastName, email, password_hash]
    );

    const u = result.rows[0];

    const token = jwt.sign(
      { id: u.id, email: u.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(201).json({
      token,
      user: {
        id: u.id,
        firstName: u.first_name,
        lastName: u.last_name,
        email: u.email,
        createdAt: u.created_at,
      },
    });
  } catch (e) {
    return res.status(409).json({ error: "Correo ya registrado" });
  }
}

export async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Faltan credenciales" });
  }

  const result = await pool.query(
    `SELECT id, first_name, last_name, email, password_hash, created_at
     FROM users WHERE email=$1`,
    [email]
  );

  const u = result.rows[0];
  if (!u) return res.status(401).json({ error: "Credenciales inválidas" });

  const ok = await bcrypt.compare(password, u.password_hash);
  if (!ok) return res.status(401).json({ error: "Credenciales inválidas" });

  const token = jwt.sign(
    { id: u.id, email: u.email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return res.json({
    token,
    user: {
      id: u.id,
      firstName: u.first_name,
      lastName: u.last_name,
      email: u.email,
      createdAt: u.created_at,
    },
  });
}

export async function me(req, res) {
  const result = await pool.query(
    `SELECT id, first_name, last_name, email, created_at
     FROM users WHERE id=$1`,
    [req.user.id]
  );

  const u = result.rows[0];

  return res.json({
    user: {
      id: u.id,
      firstName: u.first_name,
      lastName: u.last_name,
      email: u.email,
      createdAt: u.created_at,
    },
  });
}
