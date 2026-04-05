import { admin, db } from "../config/firebaseAdmin";
import { SyncUserInput, SyncUserResult } from "../types/syncUser.ts";

export const syncUserService = async ({
  id,
  name,
  email,
}: SyncUserInput): Promise<SyncUserResult> => {
  if (!id || !name || !email) {
    return {
      type: "validation_error",
      message: "id, name, and email are required",
    };
  }

  const userRef = db.collection("users").doc(id);
  const existingUserSnap = await userRef.get();

  if (existingUserSnap.exists) {
    return {
      type: "already_synced",
      data: {
        id,
        alreadySynced: true,
      },
    };
  }

  await userRef.set({
    id,
    name,
    email,
    role: "owner",
    isApproved: false,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  return {
    type: "created",
    data: {
      id,
      alreadySynced: false,
    },
  };
};
