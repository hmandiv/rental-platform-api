import { Request, Response } from "express";
import { createLeadService } from "../services/lead.service";
import { asyncHandler } from "../utils/asyncHandler";

export const createLead = asyncHandler(async (req: Request, res: Response) => {
  const result = await createLeadService(req.body);

  return res.status(201).json({
    success: true,
    message: "Lead submitted successfully",
    data: result,
  });
});
