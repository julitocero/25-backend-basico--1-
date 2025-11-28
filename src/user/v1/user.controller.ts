import { Request, Response } from "express";

import { registerUserAction } from "./register.user.action";
import { loginUserAction } from "./login.user.action";
import { getUserAction } from "./read.user.action";
import { updateUserAction } from "./update.user.actions";
import { deleteUserAction } from "./delete.user.action";

// REGISTER
export const registerUser = async (req: Request, res: Response) => {
  const response = await registerUserAction(req);
  return res.status(response.status).json(response.data);
};

// LOGIN
export const loginUser = async (req: Request, res: Response) => {
  const response = await loginUserAction(req);
  return res.status(response.status).json(response.data);
};

// GET USER BY ID
export const getUserById = async (req: Request, res: Response) => {
  const response = await getUserAction(req);
  return res.status(response.status).json(response.data);
};

// UPDATE USER
export const updateUser = async (req: Request, res: Response) => {
  const response = await updateUserAction(req);
  return res.status(response.status).json(response.data);
};

// DELETE USER
export const deleteUser = async (req: Request, res: Response) => {
  const response = await deleteUserAction(req);
  return res.status(response.status).json(response.data);
};

