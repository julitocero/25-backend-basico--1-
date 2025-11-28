import { model, Schema } from "mongoose";

// DECLARE MODEL TYPE

type ReservationType = {
  userId: string;        
  username: string;
  reservedAt: Date;
  returnedAt?: Date; 
};

type BookType = {
  name: string,
  autor: string,
  editorial: string,
  genero: string,
  publicacion: Date,
  reservations: ReservationType[],
  reserved: boolean,
  isActive: boolean,
};

// DECLARE MONGOOSE SCHEMA
const BookSchema = new Schema<BookType>({
  name: {type: String, unique: true, required:true},
  autor: {type: String, required: true},
  editorial: {type: String, required: true},
  genero: {type: String, required: true},
  publicacion: {type: Date, required: true },
  reservations: { type :[
    {
      userId: { type: String, ref: "User", required: true },
      username: { type: String, required: true },
      reservedAt: { type: Date, required: true },
      returnedAt: { type: Date }
    }
  ], default: [] }, 
  reserved: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

// DECLARE MONGO MODEL
const BookModel = model<BookType>("Book", BookSchema);

// EXPORT ALL
export { BookModel, BookSchema, BookType };