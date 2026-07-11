import { Router } from "express";
import {
  resendVerificationEmail,
  signupOwner,
} from "../controllers/auth.controller";
import { validate } from "../middlewares/validate";
import { SignupSchema } from "../schemas/auth.schema";
import { requireAuth } from "../middlewares/requireAuth";

const router = Router();

router.post("/signup", validate(SignupSchema), signupOwner);

router.post("/resend-verification-email", requireAuth, resendVerificationEmail);

export default router;
