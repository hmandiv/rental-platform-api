import crypto from "node:crypto";
import { admin, db } from "../config/firebaseAdmin";
import { CreateLeadInput, Lead } from "../types/lead";
import { AppError } from "../utils/appError";

export const createLeadService = async (
  input: CreateLeadInput,
): Promise<Lead> => {
  const propertyDoc = await db
    .collection("properties")
    .doc(input.propertyId)
    .get();

  if (!propertyDoc.exists) {
    throw new AppError("Property not found", 404);
  }

  const property = propertyDoc.data();

  if (!property || property.status !== "approved") {
    throw new AppError("Property not found", 404);
  }

  const lead: Lead = {
    id: crypto.randomUUID(),
    propertyId: input.propertyId,
    ownerId: property.ownerId,
    name: input.name,
    email: input.email,
    message: input.message,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  await db.collection("leads").doc(lead.id).set(lead);

  return lead;
};
