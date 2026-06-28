import {
  AdminPropertyStatusFilter,
  CreatePropertyInput,
  Property,
  PropertyActionUser,
  UpdateOwnerPropertyInput,
  UpdatePropertyStatusInput,
} from "../types/property";
import crypto from "node:crypto";
import { admin, db } from "../config/firebaseAdmin";
import { AppError } from "../utils/appError";

export const createPropertyService = async (
  input: CreatePropertyInput,
): Promise<Property> => {
  const property = {
    id: crypto.randomUUID(),
    ...input,
    status: "pending",
    isFeatured: false,
    isArchived: false,
    archivedAt: null,
    archivedBy: null,
    rejectionComment: null,
    rejectedAt: null,
    rejectedBy: null,
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
    .where("isArchived", "==", false)
    .orderBy("createdAt", "desc")
    .get();

  return snapshot.docs.map((doc) => {
    const data = doc.data();

    return {
      ...data,
      id: doc.id,
      createdAt: data.createdAt?.toDate?.().toISOString?.() ?? null,
      archivedAt: data.archivedAt?.toDate?.().toISOString?.() ?? null,
      isArchived: data.isArchived ?? false,
      archivedBy: data.archivedBy ?? null,
    } as Property;
  });
};

export const getPublicPropertyByIdService = async (
  propertyId: string,
): Promise<Property> => {
  const propertyDoc = await db.collection("properties").doc(propertyId).get();

  if (!propertyDoc.exists) {
    throw new AppError("Property not found", 404);
  }

  const data = propertyDoc.data();

  if (!data || data.status !== "approved" || data.isArchived === true) {
    throw new AppError("Property not found", 404);
  }

  return {
    ...data,
    id: propertyDoc.id,
    createdAt: data.createdAt?.toDate?.().toISOString?.() ?? null,
  } as Property;
};

export const getOwnerPropertiesService = async (
  ownerId: string,
): Promise<Property[]> => {
  const snapshot = await db
    .collection("properties")
    .where("ownerId", "==", ownerId)
    .get();

  return snapshot.docs.map((doc) => {
    const data = doc.data();

    return {
      ...data,
      id: doc.id,
      createdAt: data.createdAt?.toDate?.().toISOString?.() ?? null,
      archivedAt: data.archivedAt?.toDate?.().toISOString?.() ?? null,
      isArchived: data.isArchived ?? false,
      archivedBy: data.archivedBy ?? null,
    } as Property;
  });
};

export const getPendingPropertiesService = async (): Promise<Property[]> => {
  const snapshot = await db
    .collection("properties")
    .where("status", "==", "pending")
    .where("isArchived", "==", false)
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

const allowedAdminPropertyStatuses: AdminPropertyStatusFilter[] = [
  "pending",
  "approved",
  "rejected",
];

export const getAdminPropertiesService = async (
  status?: string,
): Promise<Property[]> => {
  if (
    status &&
    !allowedAdminPropertyStatuses.includes(status as AdminPropertyStatusFilter)
  ) {
    throw new AppError("Invalid property status filter", 400);
  }

  let query: FirebaseFirestore.Query = db.collection("properties");

  if (status) {
    query = query.where("status", "==", status);
  }

  const snapshot = await query.get();

  return snapshot.docs
    .map((doc) => {
      const data = doc.data();

      return {
        ...data,
        id: doc.id,
        createdAt: data.createdAt?.toDate?.().toISOString?.() ?? null,
        archivedAt: data.archivedAt?.toDate?.().toISOString?.() ?? null,
        isArchived: data.isArchived ?? false,
        archivedBy: data.archivedBy ?? null,
      } as Property;
    })
    .filter((property) => property.isArchived !== true);
};

export const getAdminPropertyByIdService = async (
  propertyId: string,
): Promise<Property> => {
  const propertyDoc = await db.collection("properties").doc(propertyId).get();

  if (!propertyDoc.exists) {
    throw new AppError("Property not found", 404);
  }

  const data = propertyDoc.data();

  if (!data) {
    throw new AppError("Property not found", 404);
  }

  return {
    ...data,
    id: propertyDoc.id,
    createdAt: data.createdAt?.toDate?.().toISOString?.() ?? null,
    archivedAt: data.archivedAt?.toDate?.().toISOString?.() ?? null,
    isArchived: data.isArchived ?? false,
    archivedBy: data.archivedBy ?? null,
  } as Property;
};

export const updatePropertyStatusService = async ({
  propertyId,
  input,
  adminId,
}: {
  propertyId: string;
  input: UpdatePropertyStatusInput;
  adminId: string;
}): Promise<Property> => {
  const propertyRef = db.collection("properties").doc(propertyId);
  const propertySnap = await propertyRef.get();

  if (!propertySnap.exists) {
    throw new AppError("Property not found", 404);
  }

  const updates: FirebaseFirestore.UpdateData<FirebaseFirestore.DocumentData> =
    {
      status: input.status,
    };

  if (input.status === "rejected") {
    updates.rejectionComment = input.rejectionComment?.trim() ?? "";
    updates.rejectedAt = admin.firestore.FieldValue.serverTimestamp();
    updates.rejectedBy = adminId;
  }

  if (input.status === "approved") {
    updates.rejectionComment = null;
    updates.rejectedAt = null;
    updates.rejectedBy = null;
  }

  await propertyRef.update(updates);

  const updatedSnap = await propertyRef.get();
  const updatedData = updatedSnap.data();

  if (!updatedData) {
    throw new AppError("Property not found", 404);
  }

  return {
    ...updatedData,
    id: updatedSnap.id,
    createdAt: updatedData.createdAt?.toDate?.().toISOString?.() ?? null,
    archivedAt: updatedData.archivedAt?.toDate?.().toISOString?.() ?? null,
    isArchived: updatedData.isArchived ?? false,
    archivedBy: updatedData.archivedBy ?? null,
    rejectionComment: updatedData.rejectionComment ?? null,
    rejectedAt: updatedData.rejectedAt?.toDate?.().toISOString?.() ?? null,
    rejectedBy: updatedData.rejectedBy ?? null,
  } as Property;
};

export const getOwnerPropertyByIdService = async (
  ownerId: string,
  propertyId: string,
): Promise<Property> => {
  const propertyRef = db.collection("properties").doc(propertyId);
  const propertySnap = await propertyRef.get();

  if (!propertySnap.exists) {
    throw new AppError("Property not found", 404);
  }

  const data = propertySnap.data();

  if (!data || data.ownerId !== ownerId) {
    throw new AppError("Forbidden", 403);
  }

  return {
    ...data,
    id: propertySnap.id,
    createdAt: data.createdAt?.toDate?.().toISOString?.() ?? null,
    archivedAt: data.archivedAt?.toDate?.().toISOString?.() ?? null,
    isArchived: data.isArchived ?? false,
    archivedBy: data.archivedBy ?? null,
    rejectionComment: data.rejectionComment ?? null,
    rejectedAt: data.rejectedAt?.toDate?.().toISOString?.() ?? null,
    rejectedBy: data.rejectedBy ?? null,
  } as Property;
};

export const updateOwnerPropertyService = async ({
  ownerId,
  propertyId,
  input,
}: {
  ownerId: string;
  propertyId: string;
  input: UpdateOwnerPropertyInput;
}): Promise<Property> => {
  const propertyRef = db.collection("properties").doc(propertyId);
  const propertySnap = await propertyRef.get();

  if (!propertySnap.exists) {
    throw new AppError("Property not found", 404);
  }

  const existingProperty = propertySnap.data();

  if (!existingProperty || existingProperty.ownerId !== ownerId) {
    throw new AppError("Forbidden", 403);
  }

  const updates: UpdateOwnerPropertyInput = {
    ...(input.title !== undefined ? { title: input.title } : {}),
    ...(input.description !== undefined
      ? { description: input.description }
      : {}),
    ...(input.price !== undefined ? { price: input.price } : {}),
    ...(input.location !== undefined ? { location: input.location } : {}),
  };

  await propertyRef.update({
    ...updates,
    status: "pending",
    rejectionComment: null,
    rejectedAt: null,
    rejectedBy: null,
  });

  const updatedSnap = await propertyRef.get();
  const updatedData = updatedSnap.data();

  if (!updatedData) {
    throw new AppError("Property not found", 404);
  }

  return {
    ...updatedData,
    id: updatedSnap.id,
    createdAt: updatedData.createdAt?.toDate?.().toISOString?.() ?? null,
    archivedAt: updatedData.archivedAt?.toDate?.().toISOString?.() ?? null,
    isArchived: updatedData.isArchived ?? false,
    archivedBy: updatedData.archivedBy ?? null,
    rejectionComment: updatedData.rejectionComment ?? null,
    rejectedAt: updatedData.rejectedAt?.toDate?.().toISOString?.() ?? null,
    rejectedBy: updatedData.rejectedBy ?? null,
  } as Property;
};

export const archivePropertyService = async ({
  propertyId,
  user,
}: {
  propertyId: string;
  user: PropertyActionUser;
}): Promise<Property> => {
  const propertyRef = db.collection("properties").doc(propertyId);
  const propertySnap = await propertyRef.get();

  if (!propertySnap.exists) {
    throw new AppError("Property not found", 404);
  }

  const existingProperty = propertySnap.data();

  ensureCanManagePropertyLifecycle(existingProperty, user);

  await propertyRef.update({
    isArchived: true,
    archivedAt: admin.firestore.FieldValue.serverTimestamp(),
    archivedBy: user.uid,
  });

  const updatedSnap = await propertyRef.get();
  const updatedData = updatedSnap.data();

  if (!updatedData) {
    throw new AppError("Property not found", 404);
  }

  return {
    ...updatedData,
    id: updatedSnap.id,
    createdAt: updatedData.createdAt?.toDate?.().toISOString?.() ?? null,
    archivedAt: updatedData.archivedAt?.toDate?.().toISOString?.() ?? null,
    isArchived: updatedData.isArchived ?? false,
    archivedBy: updatedData.archivedBy ?? null,
  } as Property;
};

export const relistPropertyService = async ({
  propertyId,
  user,
}: {
  propertyId: string;
  user: PropertyActionUser;
}): Promise<Property> => {
  const propertyRef = db.collection("properties").doc(propertyId);
  const propertySnap = await propertyRef.get();

  if (!propertySnap.exists) {
    throw new AppError("Property not found", 404);
  }

  const existingProperty = propertySnap.data();

  ensureCanManagePropertyLifecycle(existingProperty, user);

  await propertyRef.update({
    isArchived: false,
    archivedAt: null,
    archivedBy: null,
    status: "pending",
  });

  const updatedSnap = await propertyRef.get();
  const updatedData = updatedSnap.data();

  if (!updatedData) {
    throw new AppError("Property not found", 404);
  }

  return {
    ...updatedData,
    id: updatedSnap.id,
    createdAt: updatedData.createdAt?.toDate?.().toISOString?.() ?? null,
    archivedAt: updatedData.archivedAt?.toDate?.().toISOString?.() ?? null,
    isArchived: updatedData.isArchived ?? false,
    archivedBy: updatedData.archivedBy ?? null,
  } as Property;
};

export const getArchivedPropertiesService = async (): Promise<Property[]> => {
  const snapshot = await db
    .collection("properties")
    .where("isArchived", "==", true)
    .get();

  return snapshot.docs.map((doc) => {
    const data = doc.data();

    return {
      ...data,
      id: doc.id,
      createdAt: data.createdAt?.toDate?.().toISOString?.() ?? null,
      archivedAt: data.archivedAt?.toDate?.().toISOString?.() ?? null,
      isArchived: data.isArchived ?? false,
      archivedBy: data.archivedBy ?? null,
    } as Property;
  });
};

const ensureCanManagePropertyLifecycle = (
  property: FirebaseFirestore.DocumentData | undefined,
  user: PropertyActionUser,
) => {
  if (!property) {
    throw new AppError("Property not found", 404);
  }

  if (user.role === "admin") {
    return;
  }

  if (user.role !== "owner") {
    throw new AppError("Forbidden", 403);
  }

  if (!user.isApproved) {
    throw new AppError("Owner account is not approved", 403);
  }

  if (property.ownerId !== user.uid) {
    throw new AppError("Forbidden", 403);
  }
};
