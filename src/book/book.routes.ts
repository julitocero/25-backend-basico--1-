import { Router } from "express";
import { auth } from "../middlewares/auth";
import {
  createBook,
  readBook,
  readBooks,
  updateBook,
  deleteBook,
  reservarBook,
} from "./book.controller";

const router = Router();

router.post("/create",auth ,createBook);

router.post("/reservar",auth ,reservarBook);
// Obtener un book por nombre
router.get("/:name",readBook);

router.get("/",readBooks);

// Actualizar book
router.patch("/:name", auth, updateBook);

// Inhabilitar book
router.delete("/:name", auth, deleteBook);

export default router;