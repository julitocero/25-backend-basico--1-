import { Request } from "express";
import { UserModel } from "./user.model";

export const getUserAction = async (req: Request) => {
  try {
    
    const includeInactive = req.query.includeInactive === "true"; 
    const filter: any = { ndocument: req.params.id };
    if (!includeInactive) {
      filter.isActive = true;
    }
    const user = await UserModel.findOne(filter);

    if (!user) return { status: 404, data: { message: "Usuario no encontrado" } };

    return { status: 200, data: user };
  } catch (error) {
    return { status: 500, data: { message: "Error en servidor", error } };
  }
};
