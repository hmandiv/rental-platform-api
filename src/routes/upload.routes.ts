import { Router } from "express";
import { getUploadSignature } from "../controllers/upload.controller";
import {
  requireApproved,
  requireAuth,
  requireRole,
} from "../middlewares/requireAuth";

const router = Router();

router.post(
  "/sign",
  requireAuth,
  requireApproved,
  requireRole("owner", "admin"),
  getUploadSignature,
);

export default router;
