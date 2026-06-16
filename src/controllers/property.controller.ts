import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { createPropertyService } from "../services/property.service";

export const createProperty = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await createPropertyService({
      ...req.body,
      ownerId: req.user!.uid,
    });

    return res.status(201).json({
      success: true,
      message: "Property created successfully",
      data: result,
    });
  },
);
