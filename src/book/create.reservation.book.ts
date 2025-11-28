import { Request } from "express";
import { BookModel } from "./book.model";
import { UserModel } from "../user/v1/user.model";

export const reservarBookAction = async (req: Request) => {
    try {
        if(!req.user){
            return {status: 401, mesage: "Usuario no autenticado"}
        }
        const {userId, bookId} = req.body
        const user = await UserModel.findOne({ ndocument: userId})
        const book = await BookModel.findOne({ name: bookId})

        if(!user){
            return {status: 404, data: {mesage: "Usuario no encontrado"}}
        }
        if(!book){
            return {status: 404, data: {mesage: "Libro no encontrado"}}
        }
        if(book.reserved){
            return {status: 400, data: {mesage: "EL libro ya ha sido reservado"}}
        }
        const now = new Date()
        user.reservations.push({bookId: bookId, bookName: book.name, reservedAt: now })
        book.reservations.push({userId: userId, username: user.fname, reservedAt: now})
        book.reserved = true
        await book.save()
        await user.save()
        return(
            {
                status: 200,
                data: {
                    mesage: "El libro se ha reservado exitosamente",
                    book:{
                        id: bookId,
                        name: book.name,
                        autor: book.autor,
                        reserved: book.reserved
                    },
                    username: user.fname,
                    userId: userId
                }
            }
        )
    } catch (error) {
        return { status: 500, data: { message: "Error en servidor", error } };
    }
}