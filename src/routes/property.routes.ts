import { Router } from "express";
import {
  archiveProperty,
  createProperty,
  getAdminProperties,
  getAdminPropertyById,
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
import { requireEmailVerified } from "../middlewares/requireEmailVerified";
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

router.get(
  "/admin/:id",
  requireAuth,
  requireRole("admin"),
  getAdminPropertyById,
);

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
  requireEmailVerified,
  archiveProperty,
);

router.patch(
  "/:id/relist",
  requireAuth,
  requireRole("owner", "admin"),
  requireEmailVerified,
  relistProperty,
);

router.patch(
  "/:id",
  requireAuth,
  requireRole("owner"),
  requireEmailVerified,
  requireApproved,
  validate(UpdatePropertySchema),
  updateProperty,
);

router.post(
  "/",
  requireAuth,
  requireRole("owner", "admin"),
  requireEmailVerified,
  requireApproved,
  validate(CreatePropertySchema),
  createProperty,
);

export default router;
