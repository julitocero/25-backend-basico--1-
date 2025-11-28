import { Request } from "express";
import { UserModel } from "./user.model";

export const getUserAction = async (req: Request) => {
  try {
    const user = await UserModel.findOne({ ndocument: req.params.id });

    if (!user) return { status: 404, data: { message: "Usuario no encontrado" } };

    return { status: 200, data: user };
  } catch (error) {
    return { status: 500, data: { message: "Error en servidor", error } };
  }
};
