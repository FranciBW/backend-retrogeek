import { Router } from "express";
import {
  listProducts,
  getProduct,
  createProduct,
  deleteProduct,
  listMyProducts,
} from "../controllers/products.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", listProducts);
router.get("/mine", requireAuth, listMyProducts);
router.get("/:id", getProduct);

// protegidas
router.post("/", requireAuth, createProduct);
router.delete("/:id", requireAuth, deleteProduct);

export default router;