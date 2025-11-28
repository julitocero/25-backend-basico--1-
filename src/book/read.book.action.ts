import { Request, Response } from "express";
import { BookModel } from "./book.model";

export const readBooksAction = async (req: Request) => {
  try {
    const {
      genero,
      publicacion,
      editorial,
      autor,
      name,
      reserved,
      page = 1,
      limit = 10,
    } = req.query;

    const filters: any = {};

    if (genero) filters.genero = genero;
    if (publicacion) filters.publicacion = publicacion;
    if (editorial) filters.editorial = editorial;
    if (autor) filters.autor = autor;
    if (name) filters.name = { $regex: name, $options: "i" };
    if (reserved !== undefined) filters.reserved = reserved === "true"; //para volverlo false o true

    const includeInactive = req.query.includeInactive ==="true";
    if(!includeInactive){
      filters.isActive = true;
    }

    const p = parseInt(page as string);
    const l = parseInt(limit as string);
    const skip = (p - 1) * l;

    const [books, total] = await Promise.all([
      BookModel.find(filters).select("name").skip(skip).limit(l),
      BookModel.countDocuments(filters),
    ]);
    return { status: 200, data: {
        books,
        pagination: {
          currentPage: p,
          totalPages: Math.ceil(total / l),
          booksPerPage: l,
          totalBooks: total,
        },
      }, };
  } catch (error) {
    return { status: 500, data: { message: "Error en servidor", error } };
  }
};
