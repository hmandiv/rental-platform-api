import { z } from "zod";

export const CreateLeadSchema = z.object({
  propertyId: z
    .string("Property ID is required")
    .trim()
    .min(1, "Property ID is required"),

  name: z.string("Name is required").trim().min(1, "Name is required"),

  email: z.email("Valid email is required"),

  message: z.string("Message is required").trim().min(1, "Message is required"),
});

export type CreateLeadBody = z.infer<typeof CreateLeadSchema>;
