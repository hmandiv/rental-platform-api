import { Router } from "express";
import { signupOwner } from "../controllers/auth.controller";
import { validate } from "../middlewares/validate";
import { SignupSchema } from "../schemas/auth.schema";

const router = Router();

router.post("/signup", validate(SignupSchema), signupOwner);

export default router;
