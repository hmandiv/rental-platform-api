import cloudinary from "../config/cloudinary";
import { UploadSignInput, UploadSignResult } from "../types/uploadSign";
import { AppError } from "../utils/appError";

export const generateUploadSignature = async ({
  uid,
}: UploadSignInput): Promise<UploadSignResult> => {
  if (!uid) {
    throw new AppError("uid is required", 400);
  }

  const timestamp = Math.round(new Date().getTime() / 1000);
  const folder = `properties/${uid}`;

  const apiKey = process.env.CLOUDINARY_API_KEY;
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!apiKey || !cloudName || !apiSecret) {
    throw new AppError("Cloudinary configuration is missing", 500);
  }

  const signature = cloudinary.utils.api_sign_request(
    { timestamp, folder },
    apiSecret,
  );

  return {
    signature,
    timestamp,
    apiKey,
    cloudName,
    folder,
  };
};
