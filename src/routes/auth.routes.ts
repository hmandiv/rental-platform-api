import { Router } from "express";
import { syncUser } from "../controllers/auth.controller";
import { validate } from "../middlewares/validate";
import { SyncUserSchema } from "../schemas/auth.schema";

const router = Router();

router.post("/sync-user", validate(SyncUserSchema), syncUser);

export default router;
