import { CreatePropertyInput, Property } from "../types/property";
import crypto from "node:crypto";
import { admin, db } from "../config/firebaseAdmin";

export const createPropertyService = async (
  input: CreatePropertyInput,
): Promise<Property> => {
  const property = {
    id: crypto.randomUUID(),
    ...input,
    status: "pending",
    isFeatured: false,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  const propertyRef = db.collection("properties").doc(property.id);
  await propertyRef.set(property);

  /**
   * Not perfect, but correct for V1.
   * The real timestamp only exists after reading back from Firestore,
   * which is an extra round trip not worth doing now.
   */
  return property as unknown as Property;
};
