import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { AppError } from "../utils/appError";

export const validate =
  (schema: z.ZodType) => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const message = result.error.issues
        .map((issue) => issue.message)
        .join(", ");

      throw new AppError(message, 400);
    }

    req.body = result.data;
    next();
  };
