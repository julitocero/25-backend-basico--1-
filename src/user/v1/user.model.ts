import { model, Schema } from "mongoose";


type ReservationType = {
  bookId: string;        
  bookName: string;
  reservedAt: Date;
  returnedAt?: Date; 
};
// DECLARE MODEL TYPE
type UserType = {
  tdocument: string,
  ndocument: string,
  fname: string,
  lname: string,
  username: string,
  password: string,
  reservations: [ReservationType],
  rol: string,
  isActive: boolean,
};

// DECLARE MONGOOSE SCHEMA
const UserSchema = new Schema<UserType>({
  tdocument: {type: String, enum: ["C.C", "T.I", "C.E"], required:true},
  ndocument: {type: String, unique: true, required:true},
  fname: {type: String, required: true},
  lname: {type: String, required: true},
  username: {type: String, required: true, unique:true},
  password: {type: String, required: true },
  rol: {type: String,enum: ["admin", "person"], required: true},
  reservations: { type :[
    {
      bookId: { type: String, ref: "User", required: true },
      bookName: { type: String, required: true },
      reservedAt: { type: Date, required: true },
      returnedAt: { type: Date }
    }
  ], default: [] }, 
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

// DECLARE MONGO MODEL
const UserModel = model<UserType>("User", UserSchema);

// EXPORT ALL
export { UserModel, UserSchema, UserType };

