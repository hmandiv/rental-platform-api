import { Router } from "express";
import {
  createProperty,
  getMyProperties,
  getPendingProperties,
  getProperties,
  getPropertyById,
  updatePropertyStatus,
} from "../controllers/property.controller";
import {
  requireApproved,
  requireAuth,
  requireRole,
} from "../middlewares/requireAuth";
import { validate } from "../middlewares/validate";
import {
  CreatePropertySchema,
  UpdatePropertyStatusSchema,
} from "../schemas/property.schema";

const router = Router();

router.get("/", getProperties);

router.get("/mine", requireAuth, requireRole("owner"), getMyProperties);

router.get("/pending", requireAuth, requireRole("admin"), getPendingProperties);

router.get("/:id", getPropertyById);

router.patch(
  "/:id/status",
  requireAuth,
  requireRole("admin"),
  validate(UpdatePropertyStatusSchema),
  updatePropertyStatus,
);

router.post(
  "/",
  requireAuth,
  requireRole("owner", "admin"),
  requireApproved,
  validate(CreatePropertySchema),
  createProperty,
);

export default router;
