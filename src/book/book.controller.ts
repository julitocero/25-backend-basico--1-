import { Request, Response } from "express";

import { createBookAction } from "./create.book.action";
import { readBooksAction } from "./read.book.action";
import { readBookAction } from "./read.one.book.action";
import { updateBookAction } from "./update.book.action";
import { deleteBookAction } from "./delete.book.action";
import { reservarBookAction } from "./create.reservation.book";

// CREATE
export const createBook = async (req: Request, res: Response) => {
  const response = await createBookAction(req);
  return res.status(response.status).json(response.data);
};

// READ BOOKS WITH FILTERS
export const readBooks = async (req: Request, res: Response) => {
  const response = await readBooksAction(req);
  return res.status(response.status).json(response.data);
};

// READ A BOOK
export const readBook = async (req: Request, res: Response) => {
  const response = await readBookAction(req);
  return res.status(response.status).json(response.data);
};

// UPDATE BOOK
export const updateBook = async (req: Request, res: Response) => {
  const response = await updateBookAction(req);
  return res.status(response.status).json(response.data);
};

// DELETE BOOK
export const deleteBook = async (req: Request, res: Response) => {
  const response = await deleteBookAction(req);
  return res.status(response.status).json(response.data);
};

export const reservarBook = async (req: Request, res: Response) => {
  const response = await reservarBookAction(req);
  return res.status(response.status).json(response.data);
};
