import { Router } from "express";
import {
  approveOwner,
  getCurrentUser,
  getPendingOwners,
} from "../controllers/user.controller";
import { requireAuth, requireRole } from "../middlewares/requireAuth";

const router = Router();

router.get("/me", requireAuth, getCurrentUser);
router.get(
  "/pending-owners",
  requireAuth,
  requireRole("admin"),
  getPendingOwners,
);

router.patch("/:id/approve", requireAuth, requireRole("admin"), approveOwner);

export default router;
