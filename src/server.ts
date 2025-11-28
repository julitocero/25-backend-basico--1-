import { Request, Response } from "express";
import cors from "cors";
import express from "express";
import { connectDB } from "./config/db";

// API ROUTES IMPORTS
import userRoutes from "./user/v1/user.routes";
import bookRoutes from "./book/book.routes"
import dotenv from "dotenv";
dotenv.config();

// MIDDLEWARES
const app = express();

app.use(cors());
app.use(express.json());

connectDB();
// ROUTES
const SERVER_VERSION = "/api/v1/";

app.use(SERVER_VERSION + "users", userRoutes);
app.use(SERVER_VERSION   + "books", bookRoutes);

// FALLBACKS

function routeNotFound(request: Request, response: Response) {
  response.status(404).json({
    message: "Route not found.",
  });
}

app.use(routeNotFound);

// START SERVER
app.listen(8080, () => {
  console.log("Server listening to port 8080.");
});
