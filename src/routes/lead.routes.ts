import { Router } from "express";
import { createLead } from "../controllers/lead.controller";
import { validate } from "../middlewares/validate";
import { CreateLeadSchema } from "../schemas/lead.schema";

const router = Router();

router.post("/", validate(CreateLeadSchema), createLead);

export default router;
