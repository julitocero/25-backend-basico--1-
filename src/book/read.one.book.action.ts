import { Request } from "express";
import { BookModel } from "./book.model";

export const readBookAction = async (req: Request) => {
  try {
    const filter: any = {  name: req.params.name }
    const includeInactives = req.query.includeInactive === "true";
    if(!includeInactives){
      filter.isActive =  true;
    }
    const book = await BookModel.findOne(filter);

    if (!book) return { status: 404, data: { message: "Libro no encontrado" } };

    return { status: 200, data: book };
  } catch (error) {
    return { status: 500, data: { message: "Error en servidor", error } };
  }
};
