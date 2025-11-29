import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import bcrypt from "bcryptjs";

import { UserModel } from "./user.model";

// ACTIONS
import { registerUserAction } from "./register.user.action";
import { loginUserAction } from "./login.user.action";
import { getUserAction } from "./read.user.action";
import { updateUserAction } from "./update.user.actions";
import { deleteUserAction } from "./delete.user.action";

// ---------------------------
// CONFIG TEST
// ---------------------------

let mongo: MongoMemoryServer;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());
  process.env.JWT_SECRET = "testsecret";
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongo.stop();
});

beforeEach(async () => {
  await UserModel.deleteMany({});
});

// ---------------------------
// PRUEBAS REGISTRO
// ---------------------------

describe("registerUserAction", () => {
  test("✔ debe registrar un usuario", async () => {
    const req: any = {
      body: {
        tdocument: "C.C",
        ndocument: "100",
        fname: "Juan",
        lname: "Pérez",
        username: "juan",
        password: "123456",
      },
    };

    const result = await registerUserAction(req);
    expect(result.status).toBe(201);
    expect((result.data as any).user.username).toBe("juan");
  });

  test("❌ debe fallar por falta de campos", async () => {
    const req: any = { body: {} };
    const result = await registerUserAction(req);
    expect(result.status).toBe(400);
  });
});

// ---------------------------
// PRUEBAS LOGIN
// ---------------------------

describe("loginUserAction", () => {
  test("✔ login exitoso", async () => {
    await UserModel.create({
      tdocument: "C.C",
      ndocument: "200",
      fname: "Ana",
      lname: "López",
      username: "ana",
      password: await bcrypt.hash("clave", 10),
      permissions: [],
      isActive: true,
    });

    const req: any = { body: { username: "ana", password: "clave" } };
    const result = await loginUserAction(req);

    expect(result.status).toBe(200);
    expect(result.data.token).toBeDefined();
  });

  test("❌ usuario inexistente", async () => {
    const req: any = { body: { username: "nadie", password: "123" } };
    const result = await loginUserAction(req);
    expect(result.status).toBe(404);
  });

  test("❌ contraseña incorrecta", async () => {
    await UserModel.create({
      tdocument: "C.C",
      ndocument: "201",
      fname: "Ana",
      lname: "López",
      username: "ana2",
      password: await bcrypt.hash("clave", 10),
      permissions: [],
      isActive: true,
    });

    const req: any = { body: { username: "ana2", password: "mala" } };
    const result = await loginUserAction(req);
    expect(result.status).toBe(401);
  });
});

// ---------------------------
// PRUEBAS READ USER
// ---------------------------

describe("getUserAction", () => {
  test("✔ retorna usuario activo", async () => {
    await UserModel.create({
      tdocument: "C.C",
      ndocument: "300",
      fname: "Luis",
      lname: "Gómez",
      username: "luis",
      password: "hash",
      isActive: true,
    });

    const req: any = { params: { id: "300" }, query: {} };
    const result = await getUserAction(req);

    expect(result.status).toBe(200);
  });

  test("❌ no retorna usuario inactivo sin includeInactive", async () => {
    await UserModel.create({
      tdocument: "C.C",
      ndocument: "301",
      fname: "Luis",
      lname: "Gómez",
      username: "luis",
      password: "hash",
      isActive: false,
    });

    const req: any = { params: { id: "301" }, query: {} };
    const result = await getUserAction(req);

    expect(result.status).toBe(404);
  });
});

// ---------------------------
// PRUEBAS UPDATE
// ---------------------------

describe("updateUserAction", () => {
  test("✔ usuario actualiza su propio perfil", async () => {
    await UserModel.create({
      tdocument: "C.C",
      ndocument: "400",
      fname: "Mario",
      lname: "Paz",
      username: "mario",
      password: "hash",
      permissions: ["update_user"],
      isActive: true,
    });

    const req: any = {
      params: { id: "400" },
      user: { id: "400", permissions: ["update_user"] },
      body: { fname: "MarioNuevo" },
    };

    const result = await updateUserAction(req);
    expect(result.status).toBe(200);
    expect((result.data as any).fname).toBe("MarioNuevo");
  });

  test("❌ usuario sin permisos no puede actualizar a otro", async () => {
    const req: any = {
      params: { id: "401" },
      user: { id: "500", permissions: [] },
      body: {},
    };

    const result = await updateUserAction(req);
    expect(result.status).toBe(403);
  });
});

// ---------------------------
// PRUEBAS DELETE
// ---------------------------

describe("deleteUserAction", () => {
  test("✔ usuario puede inhabilitarse a sí mismo", async () => {
    await UserModel.create({
      tdocument: "C.C",
      ndocument: "500",
      fname: "Carlos",
      lname: "Solano",
      username: "carlos",
      password: "hash",
      isActive: true,
    });

    const req: any = {
      params: { id: "500" },
      user: { id: "500", permissions: [] },
    };

    const result = await deleteUserAction(req);
    expect(result.status).toBe(200);
  });

  test("❌ usuario no puede inhabilitar a otro sin permiso", async () => {
    const req: any = {
      params: { id: "501" },
      user: { id: "999", permissions: [] },
    };

    const result = await deleteUserAction(req);
    expect(result.status).toBe(403);
  });
});
