import { Request, Response } from "express";
import {
  createOwnerAccountService,
  resendVerificationEmailService,
} from "../services/auth.service";
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

export const resendVerificationEmail = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const result = await resendVerificationEmailService({
      uid: req.user.uid,
      email: req.user.email,
    });

    return res.status(200).json({
      success: true,
      message: result.emailVerified
        ? "Email is already verified."
        : "Verification email link generated successfully.",
      data: result,
    });
  },
);
