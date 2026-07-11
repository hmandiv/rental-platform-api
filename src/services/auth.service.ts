import { admin, db } from "../config/firebaseAdmin";
import {
  CreateOwnerAccountInput,
  CreateOwnerAccountResult,
  FirebaseAdminError,
  ResendVerificationEmailInput,
  ResendVerificationEmailResult,
} from "../types/auth";
import { AppError } from "../utils/appError";

const VERIFICATION_EMAIL_COOLDOWN_MS = 5 * 60 * 1000;

const generateAndLogVerificationLink = async (email: string) => {
  const verificationLink = await admin
    .auth()
    .generateEmailVerificationLink(email);

  console.info(
    [
      "Email verification link generated:",
      `User: ${email}`,
      `Link: ${verificationLink}`,
    ].join("\n"),
  );

  return verificationLink;
};

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
      emailVerified: false,
      emailVerifiedAt: null,
      verificationEmailSentAt: admin.firestore.FieldValue.serverTimestamp(),
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    await generateAndLogVerificationLink(normalizedEmail);

    return {
      id: userRecord.uid,
      email: normalizedEmail,
      role: "owner",
      isApproved: false,
    };
  } catch (err) {
    if (createdUserId) {
      try {
        await db.collection("users").doc(createdUserId).delete();
        await admin.auth().deleteUser(createdUserId);
      } catch (cleanupError) {
        console.error("Failed to rollback created account", cleanupError);
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

export const resendVerificationEmailService = async ({
  uid,
  email,
}: ResendVerificationEmailInput): Promise<ResendVerificationEmailResult> => {
  const normalizedEmail = email.trim().toLowerCase();
  const userRef = db.collection("users").doc(uid);
  const userSnap = await userRef.get();

  if (!userSnap.exists) {
    throw new AppError("User account not found.", 404);
  }

  const authUser = await admin.auth().getUser(uid);

  if (authUser.emailVerified) {
    await userRef.update({
      emailVerified: true,
      emailVerifiedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return {
      emailVerified: true,
      resent: false,
    };
  }

  const userData = userSnap.data();
  const lastSentAt = userData?.verificationEmailSentAt;
  const lastSentMs =
    typeof lastSentAt?.toMillis === "function" ? lastSentAt.toMillis() : null;

  if (
    lastSentMs !== null &&
    Date.now() - lastSentMs < VERIFICATION_EMAIL_COOLDOWN_MS
  ) {
    throw new AppError(
      "Please wait a few minutes before requesting another verification email.",
      429,
    );
  }

  await generateAndLogVerificationLink(normalizedEmail);

  await userRef.update({
    emailVerified: false,
    verificationEmailSentAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  return {
    emailVerified: false,
    resent: true,
  };
};
