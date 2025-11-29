import { Request } from "express";
import { BookModel } from "./book.model";

export const updateBookAction = async (req: Request) =>{
    try {
        if(!req.user){
        return {status: 401, mesage: "Usuario no autenticado"}
        }
        const targetID = req.params.name
        console.log(req.user.permissions)
        if (!req.user.permissions || !req.user.permissions.includes("update_book")) {
  return {status: 403, data: {mesage: "No tienes permisos para modificar este libro"}};
}

        const updatedBook = await BookModel.findOneAndUpdate({name: targetID}, req.body, {new:true})

        if(!updatedBook){
            return {status: 400, data: {mesage:"Libro no encontrado"}}
        }
        return {status: 200, data: updatedBook}
    } catch (error) {
        return { status: 500, data: { message: "Error en servidor", error } };
    }
    

}