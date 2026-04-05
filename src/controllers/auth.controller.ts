import { Request, Response } from "express";
import { syncUserService } from "../services/auth.service";

export const syncUser = async (req: Request, res: Response) => {
  try {
    const result = await syncUserService(req.body);

    if (result.type === "validation_error") {
      return res.status(400).json({
        success: false,
        message: result.message,
      });
    }

    if (result.type === "already_synced") {
      return res.status(200).json({
        success: true,
        message: "User already synced",
        data: result.data,
      });
    }

    return res.status(201).json({
      success: true,
      message: "User synced successfully",
      data: result.data,
    });
  } catch (error) {
    console.error("syncUser error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to sync user",
    });
  }
};
