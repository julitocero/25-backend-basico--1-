import { Router } from "express";
import { auth } from "../../middlewares/auth";
import {
  registerUser,
  loginUser,
  getUserById,
  updateUser,
  deleteUser
} from "./user.controller";

const router = Router();

/**
 * Rutas públicas
 */
router.post("/register", registerUser);
router.post("/login", loginUser);

/**
 * Rutas protegidas
 */

// Obtener un usuario por ID (solo autenticado)
router.get("/:id", auth, getUserById);

// Actualizar usuario (solo dueño o admin → se valida en el controlador)
router.patch("/:id", auth, updateUser);

// Inhabilitar usuario (solo dueño o admin → se valida en el controlador)
router.delete("/:id", auth, deleteUser);

export default router;
