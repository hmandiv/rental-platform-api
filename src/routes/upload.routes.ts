import { Router } from "express";
import { getUploadSignature } from "../controllers/upload.controller";
import {
  requireApproved,
  requireAuth,
  requireRole,
} from "../middlewares/requireAuth";
import { requireEmailVerified } from "../middlewares/requireEmailVerified";

const router = Router();

router.post(
  "/sign",
  requireAuth,
  requireEmailVerified,
  requireRole("owner", "admin"),
  requireApproved,
  getUploadSignature,
);

export default router;
