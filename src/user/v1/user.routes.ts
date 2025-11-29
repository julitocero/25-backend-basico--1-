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

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/:id",getUserById);
router.patch("/:id", auth, updateUser);
router.delete("/:id", auth, deleteUser);

export default router;
