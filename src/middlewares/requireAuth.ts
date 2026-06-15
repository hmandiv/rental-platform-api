import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/appError";
import { admin, db } from "../config/firebaseAdmin";

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return next(new AppError("Unauthorized - invalid auth header", 401));
    }

    const token = authHeader.split("Bearer ")[1];

    if (!token) {
      return next(new AppError("Unauthorized — no token provided", 401));
    }

    const decoded = await admin.auth().verifyIdToken(token);

    // NOTE: This performs a Firestore read on every authenticated request.
    // This is acceptable for the current app scale and keeps role/account data centralized.
    // If traffic grows, consider moving stable auth data like role/isApproved to
    // Firebase custom claims, adding a cache, or only loading the user document
    // on routes that need full profile data.
    const userDoc = await db.collection("users").doc(decoded.uid).get();

    if (!userDoc.exists) {
      return next(new AppError("Unauthorized — user not found", 401));
    }

    const userData = userDoc.data();

    req.user = {
      uid: decoded.uid,
      role: userData?.role,
      isApproved: userData?.isApproved,
      name: userData?.name,
      email: userData?.email,
    };

    next();
  } catch (error) {
    return next(new AppError("Unauthorized — invalid token", 401));
  }
};

export const requireRole = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError("Unauthorized — no user on request", 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError("Forbidden — insufficient role", 403));
    }

    next();
  };
};

export const requireApproved = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.user?.isApproved) {
    return next(new AppError("Account pending approval", 403));
  }

  next();
};
