import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import {
  approveOwnerService,
  getPendingOwnersService,
} from "../services/user.service";
import { AppError } from "../utils/appError";

export const getCurrentUser = asyncHandler(
  async (req: Request, res: Response) => {
    return res.status(200).json({
      success: true,
      message: "Current user fetched successfully",
      data: req.user,
    });
  },
);

export const getPendingOwners = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await getPendingOwnersService();

    return res.status(200).json({
      success: true,
      message: "Pending owners fetched successfully",
      data: result,
    });
  },
);

export const approveOwner = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.params.id;

    if (!userId || Array.isArray(userId)) {
      throw new AppError("User not found", 404);
    }

    const result = await approveOwnerService(userId);

    return res.status(200).json({
      success: true,
      message: "Owner approved successfully",
      data: result,
    });
  },
);
