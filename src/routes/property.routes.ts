import { Router } from "express";
import {
  createProperty,
  getProperties,
} from "../controllers/property.controller";
import {
  requireApproved,
  requireAuth,
  requireRole,
} from "../middlewares/requireAuth";
import { validate } from "../middlewares/validate";
import { CreatePropertySchema } from "../schemas/property.schema";

const router = Router();

router.get("/", getProperties);

router.post(
  "/",
  requireAuth,
  requireRole("owner", "admin"),
  requireApproved,
  validate(CreatePropertySchema),
  createProperty,
);

export default router;
