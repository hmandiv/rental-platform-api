import { Request, Response, NextFunction } from "express";
import { isDev } from "../config/env";

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (!isDev) {
    next();
    return;
  }

  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;

    console.log(
      `${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`,
    );
  });

  next();
};
