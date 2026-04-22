import { Request, Response } from "express";
import { generateUploadSignature } from "../services/upload.service";
import { asyncHandler } from "../utils/asyncHandler";

export const getUploadSignature = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await generateUploadSignature(req.body);

    return res.status(200).json({
      success: true,
      message: "Signature generated successfully",
      data: result,
    });
  },
);
