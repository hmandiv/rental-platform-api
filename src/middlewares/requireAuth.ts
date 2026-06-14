import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/appError";
import { admin, db } from "../config/firebaseAdmin";

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return next(new AppError("Unauthorized — no token provided", 401));
    }

    const decoded = await admin.auth().verifyIdToken(token);

    const userDoc = await db.collection("users").doc(decoded.uid).get();

    if (!userDoc.exists) {
      return next(new AppError("Unauthorized — user not found", 401));
    }

    req.user = {
      uid: decoded.uid,
      role: userDoc.data()!.role,
      isApproved: userDoc.data()!.isApproved,
      name: userDoc.data()!.name,
      email: userDoc.data()!.email,
    };

    next();
  } catch (error) {
    return next(new AppError("Unauthorized — invalid token", 401));
  }
};

export const requireRole = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError("Unauthorized — no user on request", 401);
    }

    if (!roles.includes(req.user.role)) {
      throw new AppError("Forbidden — insufficient role", 403);
    }

    next();
  };
};
