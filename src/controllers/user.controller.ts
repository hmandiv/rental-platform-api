import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";

export const getCurrentUser = asyncHandler(
  async (req: Request, res: Response) => {
    return res.status(200).json({
      success: true,
      message: "Current user fetched successfully",
      data: req.user,
    });
  },
);
