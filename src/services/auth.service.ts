import { admin, db } from "../config/firebaseAdmin";
import { SyncUserInput, SyncUserServiceResult } from "../types/syncUser.ts";
import { AppError } from "../utils/appError";

export const syncUserService = async ({
  id,
  name,
  email,
}: SyncUserInput): Promise<SyncUserServiceResult> => {
  if (!id || !name || !email) {
    throw new AppError("id, name, and email are required", 400);
  }

  const userRef = db.collection("users").doc(id);
  const existingUserSnap = await userRef.get();

  if (existingUserSnap.exists) {
    return {
      id,
      alreadySynced: true,
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
    id,
    alreadySynced: false,
  };
};
