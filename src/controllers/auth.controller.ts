import { Request, Response } from "express";
import { syncUserService } from "../services/auth.service";
import { asyncHandler } from "../utils/asyncHandler";

export const syncUser = asyncHandler(async (req: Request, res: Response) => {
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
});
