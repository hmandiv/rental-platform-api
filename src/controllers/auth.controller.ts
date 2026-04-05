import { Request, Response } from "express";
import { syncUserService } from "../services/auth.service";

export const syncUser = async (req: Request, res: Response) => {
  try {
    const result = await syncUserService(req.body);

    return res.status(result.status).json(result.body);
  } catch (error) {
    console.error("syncUser error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to sync user",
    });
  }
};
