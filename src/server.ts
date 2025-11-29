// src/server.ts
import app from "./app";
import { connectDB } from "./config/db";

connectDB();

app.listen(8080, () => {
  console.log("Server listening to port 8080.");
});

