import { db } from "../config/firebaseAdmin";
import { AppError } from "../utils/appError";

export const getPendingOwnersService = async () => {
  const snapshot = await db
    .collection("users")
    .where("role", "==", "owner")
    .where("isApproved", "==", false)
    .get();

  return snapshot.docs.map((doc) => {
    const data = doc.data();

    return {
      ...data,
      uid: doc.id,
      createdAt: data.createdAt?.toDate?.().toISOString?.() ?? null,
    };
  });
};

export const approveOwnerService = async (userId: string) => {
  const userRef = db.collection("users").doc(userId);
  const userSnap = await userRef.get();

  if (!userSnap.exists) {
    throw new AppError("User not found", 404);
  }

  const user = userSnap.data();

  if (!user || user.role !== "owner") {
    throw new AppError("User is not an owner", 400);
  }

  await userRef.update({
    isApproved: true,
  });

  return {
    id: userId,
    isApproved: true,
  };
};
