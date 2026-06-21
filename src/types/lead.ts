export interface CreateLeadInput {
  propertyId: string;
  name: string;
  email: string;
  message: string;
}

export interface CreateLeadServiceInput extends CreateLeadInput {
  ownerId: string;
}

export interface Lead extends CreateLeadServiceInput {
  id: string;
  createdAt: FirebaseFirestore.FieldValue | string | null;
}
