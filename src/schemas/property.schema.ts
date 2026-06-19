import { z } from "zod";

export const PropertyImageSchema = z.object({
  url: z.url("Image URL must be valid"),
  publicId: z
    .string("Image publicId is required")
    .min(1, "Image publicId is required"),
});

export const CreatePropertySchema = z.object({
  title: z.string("Title is required").trim().min(1, "Title is required"),

  description: z
    .string("Description is required")
    .trim()
    .min(1, "Description is required"),

  price: z
    .number("Price is required")
    .finite()
    .positive("Price must be greater than 0"),

  location: z
    .string("Location is required")
    .trim()
    .min(1, "Location is required"),

  images: z.array(PropertyImageSchema),
});

export type CreatePropertyBody = z.infer<typeof CreatePropertySchema>;
