import { Request } from "express";
import { UserModel } from "./user.model";
import bcrypt from "bcryptjs";

export const updateUserAction = async (req: Request) => {
  try {
    if (!req.user) {
      return { status: 401, data: { message: "Usuario no autenticado" } };
    }
    const authId = req.user.id;
    const targetId = req.params.id;

    // Validaciones de rol
    if (authId !== targetId && req.user.rol !== "admin") {
      return {
        status: 403,
        data: { message: "No tienes permisos para modificar este usuario" }
      };
    }

    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 10);
    }

    const updated = await UserModel.findOneAndUpdate({ ndocument: req.params.id }, req.body, {
      new: true
    });

    if (!updated) {
      return { status: 404, data: { message: "Usuario no encontrado" } };
    }

    return { status: 200, data: updated };
  } catch (error) {
    return { status: 500, data: { message: "Error en servidor", error } };
  }
};
