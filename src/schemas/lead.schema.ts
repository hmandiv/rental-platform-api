import { z } from "zod";

export const CreateLeadSchema = z.object({
  propertyId: z
    .string("Property ID is required")
    .trim()
    .min(1, "Property ID is required"),

  name: z
    .string("Name is required")
    .trim()
    .min(1, "Name is required")
    .max(80, "Name must be 80 characters or less"),

  email: z
    .email("Valid email is required")
    .max(120, "Email must be 120 characters or less"),

  message: z
    .string("Message is required")
    .trim()
    .min(1, "Message is required")
    .max(1000, "Message must be 1000 characters or less"),

  turnstileToken: z
    .string("Spam protection token is required")
    .trim()
    .min(1, "Spam protection token is required")
    .max(2048, "Spam protection token is invalid"),
});

export type CreateLeadBody = z.infer<typeof CreateLeadSchema>;
