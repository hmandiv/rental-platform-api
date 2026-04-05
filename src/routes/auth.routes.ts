import { Router } from "express";
import { syncUser } from "../controllers/auth.controller";

const router = Router();

router.post("/sync-user", syncUser);

export default router;
