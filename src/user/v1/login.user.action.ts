import { Request } from "express";
import { UserModel } from "./user.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const loginUserAction = async (req: Request) => {
  try {
    const { username , password } = req.body;

    const found = await UserModel.findOne({ username, isActive: true });
    if (!found) return { status: 404, data: { message: "Usuario no encontrado" } };

    const valid = await bcrypt.compare(password, found.password);
    if (!valid) return { status: 401, data: { message: "Contraseña incorrecta" } };

    const token = jwt.sign(
      { id: found.ndocument, rol: found.rol },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    return {
      status: 200,
      data: {
        message: "Login exitoso",
        token,
        user: {
          id: found._id,
          fname: found.fname,
          lname: found.lname,
          user: found.username,
          rol: found.rol
        }
      }
    };
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return { status: 500, data: { message: "Error en servidor", error } };
  }
};
