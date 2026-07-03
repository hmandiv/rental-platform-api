import { admin, db } from "../config/firebaseAdmin";
import {
  CreateOwnerAccountInput,
  CreateOwnerAccountResult,
  FirebaseAdminError,
} from "../types/auth";
import { AppError } from "../utils/appError";

export const createOwnerAccountService = async ({
  name,
  email,
  password,
}: CreateOwnerAccountInput): Promise<CreateOwnerAccountResult> => {
  const trimmedName = name.trim();
  const normalizedEmail = email.trim().toLowerCase();

  let createdUserId: string | null = null;

  try {
    const userRecord = await admin.auth().createUser({
      email: normalizedEmail,
      password,
      displayName: trimmedName,
      emailVerified: false,
      disabled: false,
    });

    createdUserId = userRecord.uid;

    await db.collection("users").doc(userRecord.uid).set({
      id: userRecord.uid,
      name: trimmedName,
      email: normalizedEmail,
      role: "owner",
      isApproved: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return {
      id: userRecord.uid,
      email: normalizedEmail,
      role: "owner",
      isApproved: false,
    };
  } catch (err) {
    if (createdUserId) {
      try {
        await admin.auth().deleteUser(createdUserId);
      } catch (cleanupError) {
        console.error("Failed to rollback Firebase Auth user", cleanupError);
      }
    }

    const firebaseError = err as FirebaseAdminError;

    if (firebaseError.code === "auth/email-already-exists") {
      throw new AppError("An account with this email already exists.", 409);
    }

    if (
      firebaseError.code === "auth/invalid-email" ||
      firebaseError.code === "auth/invalid-password"
    ) {
      throw new AppError("Invalid signup information.", 400);
    }

    throw err;
  }
};
