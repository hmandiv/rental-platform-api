import { z } from "zod";

export const SignupSchema = z.object({
  name: z
    .string("Name is required")
    .trim()
    .min(1, "Name is required")
    .max(80, "Name must be 80 characters or less"),

  email: z
    .email("Email must be valid")
    .trim()
    .max(120, "Email must be 120 characters or less"),

  password: z
    .string("Password is required")
    .min(12, "Password must be at least 12 characters")
    .max(128, "Password must be 128 characters or less"),

  turnstileToken: z
    .string("Spam protection token is required")
    .trim()
    .min(1, "Spam protection token is required")
    .max(2048, "Spam protection token is invalid"),
});

export type SignupBody = z.infer<typeof SignupSchema>;
