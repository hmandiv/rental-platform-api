import { admin, db } from "../config/firebaseAdmin";
import SyncUserInput from "../types/syncUserInput";

export const syncUserService = async ({ id, name, email }: SyncUserInput) => {
  // 1. Validate
  if (!id || !name || !email) {
    return {
      status: 400,
      body: {
        success: false,
        message: "id, name, and email are required",
      },
    };
  }

  const userRef = db.collection("users").doc(id);
  const existingUserSnap = await userRef.get();

  // 2. Already exists
  if (existingUserSnap.exists) {
    return {
      status: 200,
      body: {
        success: true,
        message: "User already synced",
        data: {
          id,
          alreadySynced: true,
        },
      },
    };
  }

  // 3. Create user
  await userRef.set({
    id,
    name,
    email,
    role: "owner",
    isApproved: false,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  return {
    status: 201,
    body: {
      success: true,
      message: "User synced successfully",
      data: {
        id,
        alreadySynced: false,
      },
    },
  };
};
