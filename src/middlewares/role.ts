import { Request, Response, NextFunction } from "express";

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ message: "No autenticado" });
  }

  if (req.user.rol !== "admin") {
    return res.status(403).json({ message: "Acceso denegado: Solo admin" });
  }

  next();
};
