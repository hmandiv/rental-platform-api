import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import {
  createPropertyService,
  getOwnerPropertiesService,
  getPendingPropertiesService,
  getPublicPropertiesService,
  getPublicPropertyByIdService,
  updatePropertyStatusService,
} from "../services/property.service";
import { AppError } from "../utils/appError";

export const createProperty = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await createPropertyService({
      ...req.body,
      ownerId: req.user!.uid,
    });

    return res.status(201).json({
      success: true,
      message: "Property created successfully",
      data: result,
    });
  },
);

export const getProperties = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await getPublicPropertiesService();

    return res.status(200).json({
      success: true,
      message: "Properties fetched successfully",
      data: result,
    });
  },
);

export const getPropertyById = asyncHandler(
  async (req: Request, res: Response) => {
    const propertyId = req.params.id;

    if (!propertyId || Array.isArray(propertyId)) {
      throw new AppError("Property not found", 404);
    }

    const result = await getPublicPropertyByIdService(propertyId);

    return res.status(200).json({
      success: true,
      message: "Property fetched successfully",
      data: result,
    });
  },
);

export const getMyProperties = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await getOwnerPropertiesService(req.user!.uid);

    return res.status(200).json({
      success: true,
      message: "Owner properties fetched successfully",
      data: result,
    });
  },
);

export const getPendingProperties = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await getPendingPropertiesService();

    return res.status(200).json({
      success: true,
      message: "Pending properties fetched successfully",
      data: result,
    });
  },
);

export const updatePropertyStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const propertyId = req.params.id;

    if (!propertyId || Array.isArray(propertyId)) {
      throw new AppError("Property not found", 404);
    }

    const result = await updatePropertyStatusService(
      propertyId,
      req.body.status,
    );

    return res.status(200).json({
      success: true,
      message: "Property status updated successfully",
      data: result,
    });
  },
);
