import { Request, Response } from "express";
import { createOwnerAccountService } from "../services/auth.service";
import { verifyTurnstileToken } from "../services/turnstile.service";
import { SignupBody } from "../schemas/auth.schema";
import { asyncHandler } from "../utils/asyncHandler";

export const signupOwner = asyncHandler(async (req: Request, res: Response) => {
  const { turnstileToken, ...signupInput } = req.body as SignupBody;

  await verifyTurnstileToken(turnstileToken, req.ip);

  const result = await createOwnerAccountService(signupInput);

  return res.status(201).json({
    success: true,
    message: "Account created successfully",
    data: result,
  });
});
