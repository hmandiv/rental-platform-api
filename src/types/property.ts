export interface CreatePropertyInput {
  title: string;
  description: string;
  price: number;
  location: string;
  images: PropertyImage[];
  ownerId: string;
}

export interface PropertyImage {
  url: string;
  publicId: string;
}

export interface Property extends CreatePropertyInput {
  id: string;
  status: "pending" | "approved" | "rejected";
  isFeatured: boolean;
  isArchived: boolean;
  archivedAt: string | null;
  archivedBy: string | null;
  createdAt: FirebaseFirestore.Timestamp;
}

export type UpdateOwnerPropertyInput = {
  title?: string;
  description?: string;
  price?: number;
  location?: string;
};

export type PropertyActionUser = {
  uid: string;
  role: string;
  isApproved: boolean;
};

export type AdminPropertyStatusFilter = "pending" | "approved" | "rejected";
