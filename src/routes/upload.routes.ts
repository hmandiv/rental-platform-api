import { Router } from "express";
import { getUploadSignature } from "../controllers/upload.controller";
import { requireAuth, requireRole } from "../middlewares/requireAuth";

const router = Router();

router.post(
  "/sign",
  requireAuth,
  requireRole("owner", "admin"),
  getUploadSignature
);

export default router;