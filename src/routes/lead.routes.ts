import { Router } from "express";
import { createLead, getAdminLeads } from "../controllers/lead.controller";
import { validate } from "../middlewares/validate";
import { CreateLeadSchema } from "../schemas/lead.schema";
import { requireAuth, requireRole } from "../middlewares/requireAuth";

const router = Router();

router.get("/", requireAuth, requireRole("admin"), getAdminLeads);

router.post("/", validate(CreateLeadSchema), createLead);

export default router;
