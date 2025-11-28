import { Request } from "express";
import { NodeWorker } from "inspector/promises";
import { BookModel } from "./book.model";

export const deleteBookAction = async (req: Request) =>{

    try {
        if(!req.user){
            return {status: 401, data: {mesage: "Usuario no autenticado"}}
        }
        const targetID = req.params.id

        if(req.user.rol !== "admin"){
            return {status: 403, data:{mesage: "No tienes permisos para eliminar este libro"}}
        }

        const disabled = await BookModel.findOneAndUpdate(
        {name: targetID},
        { isActive: false },
        { new: true }
        );
        if(!disabled){
            return {status: 400, data: {mesage:"Libro no encontrado"}}
        }
        return { status: 200, data: { message: "Libro inhabilitado", book: disabled } };
    } catch (error) {
        return { status: 500, data: { message: "Error en servidor", error } };
    }
        

    

}