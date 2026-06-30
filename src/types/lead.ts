export interface CreateLeadInput {
  propertyId: string;
  name: string;
  email: string;
  message: string;
}

export interface LeadPropertySnapshot {
  title: string;
  location: string;
  price: number;
}

export interface CreateLeadServiceInput extends CreateLeadInput {
  ownerId: string;
  property: LeadPropertySnapshot;
}

export interface Lead extends CreateLeadServiceInput {
  id: string;
  createdAt: FirebaseFirestore.FieldValue | string | null;
}
