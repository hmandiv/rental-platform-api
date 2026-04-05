import { Request, Response, NextFunction } from "express";
import { syncUserService } from "../services/auth.service";

export const syncUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await syncUserService(req.body);

    if (result.alreadySynced) {
      return res.status(200).json({
        success: true,
        message: "User already synced",
        data: result,
      });
    }

    return res.status(201).json({
      success: true,
      message: "User synced successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
