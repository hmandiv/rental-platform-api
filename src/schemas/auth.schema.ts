import { z } from "zod";

export const SyncUserSchema = z.object({
  id: z.string("User id is required").min(1, "User id is required"),
  name: z.string("Name is required").trim().min(1, "Name is required"),
  email: z.email("Email must be valid"),
});
