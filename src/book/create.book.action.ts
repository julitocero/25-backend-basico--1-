import { Request } from "express";
import { BookModel } from "./book.model";
import { error } from "console";

export const createBookAction  = async (req: Request) =>{
    try {
        const {name, autor, editorial, genero, publicacion} = req.body
        if(!name || !autor || !editorial || !genero || !publicacion ){
            return {status: 400, data: {message: "Todos los campos son obligatorios"}}
        }

        const existingBook = await BookModel.findOne({name})
        if(existingBook){
            return {status: 400, data: {message: "El libro ya ha sido creado anteriomente"}}
        }

        const newBook = await BookModel.create({
                name,
                autor,
                editorial,
                genero,
                publicacion,
            }
        )
        return(
            {
                status: 200,
                data: {
                    mesage: "Libro creado exitosamente",
                    book: {
                        id: newBook._id,
                        autor: autor,
                        editorial: editorial,
                        genero: genero,
                        publicacion: publicacion,
                    }
                }
            }
        )
    } catch (error) {
        return { status: 500, data: { message: "Error en servidor", error } };
    }
}