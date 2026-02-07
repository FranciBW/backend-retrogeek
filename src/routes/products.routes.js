import { Router } from "express";
import {
  listProducts,
  getProduct,
  createProduct,
  deleteProduct,
  listMyProducts,
  updateProduct,
} from "../controllers/products.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

// públicas
router.get("/", listProducts);
router.get("/:id", getProduct);

// protegidas
router.get("/mine", requireAuth, listMyProducts);
router.post("/", requireAuth, createProduct);
router.put("/:id", requireAuth, updateProduct);
router.delete("/:id", requireAuth, deleteProduct);

export default router;
