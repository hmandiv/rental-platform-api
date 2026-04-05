import { Request, Response } from "express";
import { admin, db } from "../config/firebaseAdmin";

export const syncUser = async (req: Request, res: Response) => {
  try {
    const { id, name, email } = req.body;

    // 1. Validate required fields
    if (!id || !name || !email) {
      return res.status(400).json({
        success: false,
        message: "id, name, and email are required",
      });
    }

    // 2. Check if user doc already exists
    const userRef = db.collection("users").doc(id);
    const existingUserSnap = await userRef.get();

    if (existingUserSnap.exists) {
      return res.status(200).json({
        success: true,
        message: "User already synced",
        data: {
          id,
          alreadySynced: true,
        },
      });
    }

    // 3. Create Firestore user doc with backend-owned defaults
    await userRef.set({
      id,
      name,
      email,
      role: "owner",
      isApproved: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return res.status(201).json({
      success: true,
      message: "User synced successfully",
      data: {
        id,
        alreadySynced: false,
      },
    });
  } catch (error) {
    console.error("syncUser error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to sync user",
    });
  }
};
