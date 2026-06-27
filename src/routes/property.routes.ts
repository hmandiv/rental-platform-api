import { Router } from "express";
import {
  archiveProperty,
  createProperty,
  getAdminProperties,
  getArchivedProperties,
  getMyProperties,
  getMyPropertyById,
  getPendingProperties,
  getProperties,
  getPropertyById,
  relistProperty,
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

router.get(
  "/archived",
  requireAuth,
  requireRole("admin"),
  getArchivedProperties,
);

router.get("/admin", requireAuth, requireRole("admin"), getAdminProperties);

router.get("/:id", getPropertyById);

router.patch(
  "/:id/status",
  requireAuth,
  requireRole("admin"),
  validate(UpdatePropertyStatusSchema),
  updatePropertyStatus,
);

router.patch(
  "/:id/archive",
  requireAuth,
  requireRole("owner", "admin"),
  archiveProperty,
);

router.patch(
  "/:id/relist",
  requireAuth,
  requireRole("owner", "admin"),
  relistProperty,
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
