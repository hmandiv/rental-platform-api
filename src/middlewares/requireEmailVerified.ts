import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/appError";

export const requireEmailVerified = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  if (!req.user) {
    return next(new AppError("Unauthorized", 401));
  }

  if (req.user.role === "admin") {
    return next();
  }

  if (!req.user.emailVerified) {
    return next(
      new AppError("Please verify your email before continuing.", 403),
    );
  }

  return next();
};
