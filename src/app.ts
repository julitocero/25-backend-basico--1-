// src/app.ts
import { Request, Response } from "express";
import cors from "cors";
import express from "express";
import userRoutes from "./user/v1/user.routes";
import bookRoutes from "./book/book.routes";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// ROUTES
const SERVER_VERSION = "/api/v1/";

app.use(SERVER_VERSION + "users", userRoutes);
app.use(SERVER_VERSION + "books", bookRoutes);

// FALLBACKS
function routeNotFound(req: Request, res: Response) {
  res.status(404).json({
    message: "Route not found.",
  });
}

app.use(routeNotFound);

export default app;
