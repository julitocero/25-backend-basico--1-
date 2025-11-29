import { Request } from "express";
import { UserModel } from "./user.model";

export const deleteUserAction = async (req: Request) => {
  try {
    if (!req.user) {
      return { status: 401, data: { message: "Usuario no autenticado" } };
    }
    const authId = req.user.id;
    const targetId = req.params.id;

    if (authId !== targetId && !req.user.permissions.includes("disable_user")) {
      return {
        status: 403,
        data: { message: "No tienes permisos para inhabilitar este usuario" }
      };
    }

    const disabled = await UserModel.findOneAndUpdate(
      {ndocument: targetId},
      { isActive: false },
      { new: true }
    );

    if (!disabled) {
      return { status: 404, data: { message: "Usuario no encontrado" } };
    }

    return { status: 200, data: { message: "Usuario inhabilitado", user: disabled } };
  } catch (error) {
    return { status: 500, data: { message: "Error en servidor", error } };
  }
};
