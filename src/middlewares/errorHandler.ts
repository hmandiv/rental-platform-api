import { Request, Response, NextFunction } from "express";
import { isDev } from "../config/env";

type AppError = Error & {
  statusCode?: number;
};

export const errorHandler = (
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";

  if (isDev) {
    console.error("ERROR:", err);
  } else {
    console.error("ERROR:", message);
  }

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(isDev && { stack: err.stack }),
  });
};
