import { Router } from "express";
import { createProperty } from "../controllers/property.controller";
import {
  requireAuth,
  requireApproved,
  requireRole,
} from "../middlewares/requireAuth";

const router = Router();

router.post(
  "/",
  requireAuth,
  requireRole("owner", "admin"),
  requireApproved,
  createProperty,
);

export default router;
