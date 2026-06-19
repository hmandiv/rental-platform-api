import { Router } from "express";
import { createProperty } from "../controllers/property.controller";
import {
  requireApproved,
  requireAuth,
  requireRole,
} from "../middlewares/requireAuth";
import { validate } from "../middlewares/validate";
import { CreatePropertySchema } from "../schemas/property.schema";

const router = Router();

router.post(
  "/",
  requireAuth,
  requireRole("owner", "admin"),
  requireApproved,
  validate(CreatePropertySchema),
  createProperty,
);

export default router;
