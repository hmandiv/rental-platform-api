import { Router } from "express";
import {
  createProperty,
  getMyProperties,
  getMyPropertyById,
  getPendingProperties,
  getProperties,
  getPropertyById,
  updateProperty,
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
  UpdatePropertySchema,
  UpdatePropertyStatusSchema,
} from "../schemas/property.schema";

const router = Router();

router.get("/", getProperties);

router.get("/mine", requireAuth, requireRole("owner"), getMyProperties);

router.get("/mine/:id", requireAuth, requireRole("owner"), getMyPropertyById);

router.get("/pending", requireAuth, requireRole("admin"), getPendingProperties);

router.get("/:id", getPropertyById);

router.patch(
  "/:id/status",
  requireAuth,
  requireRole("admin"),
  validate(UpdatePropertyStatusSchema),
  updatePropertyStatus,
);

router.patch(
  "/:id",
  requireAuth,
  requireRole("owner"),
  requireApproved,
  validate(UpdatePropertySchema),
  updateProperty,
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
