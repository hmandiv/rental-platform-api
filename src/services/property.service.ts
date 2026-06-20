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

export const getPublicPropertiesService = async (): Promise<Property[]> => {
  const snapshot = await db
    .collection("properties")
    .where("status", "==", "approved")
    .orderBy("createdAt", "desc")
    .get();

  return snapshot.docs.map((doc) => {
    const data = doc.data();

    return {
      ...data,
      id: doc.id,
      createdAt: data.createdAt?.toDate?.().toISOString?.() ?? null,
    } as Property;
  });
};
