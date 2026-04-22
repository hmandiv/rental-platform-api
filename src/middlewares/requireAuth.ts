import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/appError";

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { uid } = req.body;

  if (!uid) {
    throw new AppError("Unauthorized — no uid provided", 401);
  }

  next();
};

export const requireRole = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { role } = req.body;

    if (!role || !roles.includes(role)) {
      throw new AppError("Forbidden — insufficient role", 403);
    }

    next();
  };
};
