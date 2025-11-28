import { Request } from "express";
import { UserModel } from "./user.model";
import bcrypt from "bcryptjs";

export const registerUserAction = async (req: Request) => {
  try {
    const { tdocument, ndocument, fname, lname, username, password, rol } = req.body;

    if (!username || !password || !fname || !lname || !tdocument || !ndocument || !rol) {
      return { status: 400, data: { message: "Faltan campos obligatorios" } };
    }

    const existingUser = await UserModel.findOne({
      $or: [{ ndocument }, { username }]
    });

    if (existingUser) {
      return { status: 400, data: { message: "El usuario ya existe" } };
    }

    const hashed = await bcrypt.hash(password, 10);

    const newUser = await UserModel.create({
      tdocument,
      ndocument,
      fname,
      lname,
      username,
      password: hashed,
      rol
    });

    return {
      status: 201,
      data: {
        message: "Usuario creado",
        user: {
          id: newUser._id,
          fname,
          lname,
          username,
          rol
        }
      }
    };
  } catch (error) {
    return { status: 500, data: { message: "Error en servidor", error } };
  }
};
