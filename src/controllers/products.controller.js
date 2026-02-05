import { pool } from "../db/pool.js";

export async function listProducts(_req, res) {
  const result = await pool.query(
    `SELECT p.*, u.email AS seller_email
     FROM products p
     JOIN users u ON u.id = p.user_id
     ORDER BY p.created_at DESC`
  );
  return res.json(result.rows);
}

export async function getProduct(req, res) {
  const { id } = req.params;
  const result = await pool.query(
    `SELECT p.*, u.email AS seller_email
     FROM products p
     JOIN users u ON u.id = p.user_id
     WHERE p.id=$1`,
    [id]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ error: "Producto no existe" });
  }

  return res.json(result.rows[0]);
}

export async function createProduct(req, res) {
  const { name, category, condition, price, quantity, image, description } =
    req.body;

  if (!name || !category || !condition || price == null) {
    return res.status(400).json({ error: "Faltan datos del producto" });
  }

  const result = await pool.query(
    `INSERT INTO products (user_id, name, category, condition, price, quantity, image, description)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
     RETURNING *`,
    [
      req.user.id,
      name,
      category,
      condition,
      Number(price),
      Number(quantity || 1),
      image || null,
      description || null,
    ]
  );

  return res.status(201).json(result.rows[0]);
}

export async function deleteProduct(req, res) {
  const { id } = req.params;

  const own = await pool.query(`SELECT user_id FROM products WHERE id=$1`, [id]);
  if (own.rows.length === 0) return res.status(404).json({ error: "No existe" });

  if (own.rows[0].user_id !== req.user.id) {
    return res.status(403).json({ error: "No autorizado" });
  }

  await pool.query(`DELETE FROM products WHERE id=$1`, [id]);
  return res.json({ ok: true });
}

export async function listMyProducts(req, res) {
  const result = await pool.query(
    `SELECT *
     FROM products
     WHERE user_id = $1
     ORDER BY created_at DESC`,
    [req.user.id]
  );

  return res.json(result.rows);
}