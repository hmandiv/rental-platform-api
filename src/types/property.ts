export type PropertyType =
  | "apartment"
  | "house"
  | "basement"
  | "condo"
  | "room"
  | "commercial"
  | "other";

export type LeaseTerm = "monthly" | "yearly" | "short_term" | "flexible";

export interface CreatePropertyInput {
  title: string;
  description: string;
  price: number;
  location: string;
  images: PropertyImage[];

  propertyType: PropertyType | null;
  bedrooms: number | null;
  bathrooms: number | null;
  squareFeet: number | null;
  availableFrom: string | null;
  leaseTerm: LeaseTerm | null;

  parkingAvailable: boolean | null;
  utilitiesIncluded: boolean | null;
  laundryAvailable: boolean | null;
  furnished: boolean | null;
  petFriendly: boolean | null;

  customFacts: CustomPropertyFact[];

  ownerId: string;
}

export interface PropertyImage {
  url: string;
  publicId: string;
}

export interface CustomPropertyFact {
  label: string;
  value: string;
}

export interface Property extends CreatePropertyInput {
  id: string;
  status: "pending" | "approved" | "rejected";
  isFeatured: boolean;
  isArchived: boolean;
  archivedAt: string | null;
  archivedBy: string | null;
  rejectionComment: string | null;
  rejectedAt: string | null;
  rejectedBy: string | null;
  createdAt: FirebaseFirestore.Timestamp;
}

export type UpdateOwnerPropertyInput = {
  title?: string;
  description?: string;
  price?: number;
  location?: string;

  propertyType?: PropertyType | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  squareFeet?: number | null;
  availableFrom?: string | null;
  leaseTerm?: LeaseTerm | null;

  parkingAvailable?: boolean | null;
  utilitiesIncluded?: boolean | null;
  laundryAvailable?: boolean | null;
  furnished?: boolean | null;
  petFriendly?: boolean | null;

  customFacts?: CustomPropertyFact[];
};

export type PropertyActionUser = {
  uid: string;
  role: string;
  isApproved: boolean;
};

export type AdminPropertyStatusFilter = "pending" | "approved" | "rejected";

export type UpdatePropertyStatusInput = {
  status: "approved" | "rejected";
  rejectionComment?: string;
};
