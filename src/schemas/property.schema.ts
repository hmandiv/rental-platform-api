import { z } from "zod";

export const PropertyImageSchema = z.object({
  url: z.url("Image URL must be valid"),
  publicId: z
    .string("Image publicId is required")
    .min(1, "Image publicId is required"),
});

export const PropertyTypeSchema = z
  .enum([
    "apartment",
    "house",
    "basement",
    "condo",
    "room",
    "commercial",
    "other",
  ])
  .nullable()
  .optional()
  .default(null);

export const UpdatePropertyTypeSchema = z
  .enum([
    "apartment",
    "house",
    "basement",
    "condo",
    "room",
    "commercial",
    "other",
  ])
  .nullable()
  .optional();

export const LeaseTermSchema = z
  .enum(["monthly", "yearly", "short_term", "flexible"])
  .nullable()
  .optional()
  .default(null);

export const UpdateLeaseTermSchema = z
  .enum(["monthly", "yearly", "short_term", "flexible"])
  .nullable()
  .optional();

export const OptionalNonNegativeNumberCreateSchema = z
  .number()
  .finite()
  .nonnegative()
  .nullable()
  .optional()
  .default(null);

export const OptionalNonNegativeNumberUpdateSchema = z
  .number()
  .finite()
  .nonnegative()
  .nullable()
  .optional();

export const OptionalPositiveNumberCreateSchema = z
  .number()
  .finite()
  .positive()
  .nullable()
  .optional()
  .default(null);

export const OptionalPositiveNumberUpdateSchema = z
  .number()
  .finite()
  .positive()
  .nullable()
  .optional();

export const OptionalBooleanCreateSchema = z
  .boolean()
  .nullable()
  .optional()
  .default(null);

export const OptionalBooleanUpdateSchema = z.boolean().nullable().optional();

export const AvailableFromCreateSchema = z
  .string()
  .trim()
  .min(1, "Available from is required")
  .nullable()
  .optional()
  .default(null);

export const AvailableFromUpdateSchema = z
  .string()
  .trim()
  .min(1, "Available from is required")
  .nullable()
  .optional();

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

  propertyType: PropertyTypeSchema,
  bedrooms: OptionalNonNegativeNumberCreateSchema,
  bathrooms: OptionalNonNegativeNumberCreateSchema,
  squareFeet: OptionalPositiveNumberCreateSchema,
  availableFrom: AvailableFromCreateSchema,
  leaseTerm: LeaseTermSchema,

  parkingAvailable: OptionalBooleanCreateSchema,
  utilitiesIncluded: OptionalBooleanCreateSchema,
  laundryAvailable: OptionalBooleanCreateSchema,
  furnished: OptionalBooleanCreateSchema,
  petFriendly: OptionalBooleanCreateSchema,
});

export const UpdatePropertyStatusSchema = z
  .object({
    status: z.enum(["approved", "rejected"]),
    rejectionComment: z
      .string()
      .trim()
      .max(1000, "Rejection comment must be 1000 characters or less")
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.status === "rejected" && !data.rejectionComment?.trim()) {
      ctx.addIssue({
        code: "custom",
        path: ["rejectionComment"],
        message: "Rejection comment is required when rejecting a property",
      });
    }
  });

export const UpdatePropertySchema = z
  .object({
    title: z.string().min(1, "Title is required").optional(),
    description: z.string().min(1, "Description is required").optional(),
    price: z.number().positive("Price must be greater than 0").optional(),
    location: z.string().min(1, "Location is required").optional(),

    propertyType: UpdatePropertyTypeSchema,
    bedrooms: OptionalNonNegativeNumberUpdateSchema,
    bathrooms: OptionalNonNegativeNumberUpdateSchema,
    squareFeet: OptionalPositiveNumberUpdateSchema,
    availableFrom: AvailableFromUpdateSchema,
    leaseTerm: UpdateLeaseTermSchema,

    parkingAvailable: OptionalBooleanUpdateSchema,
    utilitiesIncluded: OptionalBooleanUpdateSchema,
    laundryAvailable: OptionalBooleanUpdateSchema,
    furnished: OptionalBooleanUpdateSchema,
    petFriendly: OptionalBooleanUpdateSchema,
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
  });

export type CreatePropertyBody = z.infer<typeof CreatePropertySchema>;
export type UpdatePropertyBody = z.infer<typeof UpdatePropertySchema>;
export type UpdatePropertyStatusBody = z.infer<
  typeof UpdatePropertyStatusSchema
>;
