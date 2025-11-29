/**
 * TESTS DE LIBROS
 * - Basados en tus actions, tus rutas y tu modelo REAL
 * - Con MongoMemoryServer
 * - Con Supertest
 */

import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";
import express from "express";
import cors from "cors";

import bookRoutes from "./book.routes";
import userRoutes from "../user/v1/user.routes";

import { BookModel } from "./book.model";
import { UserModel } from "../user/v1/user.model";

import jwt from "jsonwebtoken";

// Crear app igual que en server.ts
function createApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.use("/api/v1/books", bookRoutes);
  app.use("/api/v1/users", userRoutes);

  return app;
}

let app: any;
let mongo: MongoMemoryServer;

// Función para crear tokens de prueba
function generateToken(payload: any) {
  return jwt.sign(payload, "testsecret", { expiresIn: "7d" });
}

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());

  process.env.JWT_SECRET = "testsecret";

  app = createApp();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongo.stop();
});

/* ---------------------------------------------
 *   TESTS — CREATE BOOK
 * --------------------------------------------- */
describe("CREATE BOOK", () => {
  it("Debe crear un libro exitosamente", async () => {
    const token = generateToken({ id: "1", permissions: ["create_book"] });

    const res = await request(app)
      .post("/api/v1/books/create")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "LibroTest",
        autor: "Autor",
        editorial: "Editorial",
        genero: "Terror",
        publicacion: "2020-01-01"
      });

    expect(res.status).toBe(200);
    expect(res.body.book).toBeDefined();
  });

  it("Debe fallar si faltan campos obligatorios", async () => {
    const token = generateToken({ id: "1", permissions: ["create_book"] });

    const res = await request(app)
      .post("/api/v1/books/create")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "LibroIncompleto"
      });

    expect(res.status).toBe(400);
  });

  it("Debe impedir crear un libro duplicado", async () => {
    const token = generateToken({ id: "1", permissions: ["create_book"] });

    await BookModel.create({
      name: "Duplicado",
      autor: "A",
      editorial: "Ed",
      genero: "Drama",
      publicacion: new Date()
    });

    const res = await request(app)
      .post("/api/v1/books/create")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Duplicado",
        autor: "A",
        editorial: "Ed",
        genero: "Drama",
        publicacion: "2020-01-01"
      });

    expect(res.status).toBe(400);
  });
});

/* ---------------------------------------------
 *   TESTS — READ BOOKS
 * --------------------------------------------- */
describe("READ BOOKS", () => {
  beforeAll(async () => {
    await BookModel.insertMany([
      { name: "Terror1", autor: "A", editorial: "X", genero: "Terror", publicacion: new Date(), isActive: true },
      { name: "Terror2", autor: "B", editorial: "Y", genero: "Terror", publicacion: new Date(), isActive: false },
      { name: "Drama1", autor: "C", editorial: "X", genero: "Drama", publicacion: new Date(), isActive: true }
    ]);
  });

  it("Debe devolver solo activos por defecto", async () => {
    const res = await request(app).get("/api/v1/books");

    expect(res.status).toBe(200);
    expect(res.body.books.length).toBe(2);
  });

  it("Debe incluir inactivos si se especifica includeInactive=true", async () => {
    const res = await request(app).get("/api/v1/books?includeInactive=true");

    expect(res.status).toBe(200);
    expect(res.body.books.length).toBe(3);
  });

  it("Debe filtrar por género", async () => {
    const res = await request(app).get("/api/v1/books?genero=Terror");

    expect(res.status).toBe(200);
    expect(res.body.books.length).toBe(1); // solo activos
  });
});

/* ---------------------------------------------
 *   TEST — READ ONE BOOK
 * --------------------------------------------- */
describe("READ ONE BOOK", () => {
  it("Debe retornar un libro existente", async () => {
    const res = await request(app).get("/api/v1/books/Terror1");
    expect(res.status).toBe(200);
    expect(res.body.name).toBe("Terror1");
  });

  it("Debe ocultar libros inactivos", async () => {
    const res = await request(app).get("/api/v1/books/Terror2");
    expect(res.status).toBe(404);
  });

  it("Debe retornar inactivos si se especifica includeInactive=true", async () => {
    const res = await request(app).get("/api/v1/books/Terror2?includeInactive=true");
    expect(res.status).toBe(200);
  });
});

/* ---------------------------------------------
 *   TEST — UPDATE BOOK
 * --------------------------------------------- */
describe("UPDATE BOOK", () => {
  it("Debe actualizar un libro con permisos", async () => {
    const token = generateToken({ id: "1", permissions: ["update_book"] });

    const res = await request(app)
      .patch("/api/v1/books/Terror1")
      .set("Authorization", `Bearer ${token}`)
      .send({ autor: "AutorNuevo" });

    expect(res.status).toBe(200);
    expect(res.body.autor).toBe("AutorNuevo");
  });

  it("Debe negar actualizar sin permisos", async () => {
    const token = generateToken({ id: "1", permissions: [] });

    const res = await request(app)
      .patch("/api/v1/books/Terror1")
      .set("Authorization", `Bearer ${token}`)
      .send({ autor: "X" });

    expect(res.status).toBe(403);
  });
});

/* ---------------------------------------------
 *   TEST — DELETE BOOK
 * --------------------------------------------- */
describe("DELETE BOOK", () => {
  it("Debe eliminar un libro con permisos", async () => {
    const token = generateToken({ id: "1", permissions: ["disable_book"] });

    const res = await request(app)
      .delete("/api/v1/books/Terror1")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
  });

  it("Debe rechazar eliminar sin permisos", async () => {
    const token = generateToken({ id: "1", permissions: [] });

    const res = await request(app)
      .delete("/api/v1/books/Drama1")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(403);
  });
});

/* ---------------------------------------------
 *   TEST — RESERVAR BOOK
 * --------------------------------------------- */
describe("RESERVAR BOOK", () => {

  let token: string;

  beforeAll(async () => {
    await UserModel.create({
      tdocument: "C.C",
      ndocument: "123",
      fname: "Carlos",
      lname: "Perez",
      username: "carlos",
      password: "x",
      rol: "person",
      isActive: true,
      reservations: [],
      permissions: []
    });

    token = generateToken({ id: "123", permissions: [] });
  });

  it("Debe reservar un libro correctamente", async () => {
    const book = await BookModel.create({
      name: "Reserva1",
      autor: "Auth",
      editorial: "Edit",
      genero: "Drama",
      publicacion: new Date()
    });

    const res = await request(app)
      .post("/api/v1/books/reservar")
      .set("Authorization", `Bearer ${token}`)
      .send({ userId: "123", bookId: "Reserva1" });

    expect(res.status).toBe(200);
    expect(res.body.book.reserved).toBe(true);
  });

  it("Debe fallar si el usuario no existe", async () => {
    const res = await request(app)
      .post("/api/v1/books/reservar")
      .set("Authorization", `Bearer ${token}`)
      .send({ userId: "nope", bookId: "Reserva1" });

    expect(res.status).toBe(404);
  });

  it("Debe fallar si el libro no existe", async () => {
    const res = await request(app)
      .post("/api/v1/books/reservar")
      .set("Authorization", `Bearer ${token}`)
      .send({ userId: "123", bookId: "nope" });

    expect(res.status).toBe(404);
  });
});
