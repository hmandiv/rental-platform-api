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
  createdAt: FirebaseFirestore.Timestamp;
}
