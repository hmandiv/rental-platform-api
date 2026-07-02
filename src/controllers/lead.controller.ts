import { Request, Response } from "express";
import {
  createLeadService,
  getAdminLeadsService,
} from "../services/lead.service";
import { verifyTurnstileToken } from "../services/turnstile.service";
import { CreateLeadBody } from "../schemas/lead.schema";
import { asyncHandler } from "../utils/asyncHandler";

export const createLead = asyncHandler(async (req: Request, res: Response) => {
  const { turnstileToken, ...leadInput } = req.body as CreateLeadBody;

  await verifyTurnstileToken(turnstileToken, req.ip);

  const result = await createLeadService(leadInput);

  return res.status(201).json({
    success: true,
    message: "Lead submitted successfully",
    data: result,
  });
});

export const getAdminLeads = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await getAdminLeadsService();

    return res.status(200).json({
      success: true,
      message: "Leads fetched successfully",
      data: result,
    });
  },
);
