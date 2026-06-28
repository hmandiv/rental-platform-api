import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import {
  archivePropertyService,
  createPropertyService,
  getAdminPropertiesService,
  getAdminPropertyByIdService,
  getArchivedPropertiesService,
  getOwnerPropertiesService,
  getOwnerPropertyByIdService,
  getPendingPropertiesService,
  getPublicPropertiesService,
  getPublicPropertyByIdService,
  relistPropertyService,
  updateOwnerPropertyService,
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

export const getAdminProperties = asyncHandler(
  async (req: Request, res: Response) => {
    const status = req.query.status;

    if (status !== undefined && typeof status !== "string") {
      throw new AppError("Invalid property status filter", 400);
    }

    const result = await getAdminPropertiesService(status);

    return res.status(200).json({
      success: true,
      message: "Admin properties fetched successfully",
      data: result,
    });
  },
);

export const getAdminPropertyById = asyncHandler(
  async (req: Request, res: Response) => {
    const propertyId = req.params.id;

    if (!propertyId || Array.isArray(propertyId)) {
      throw new AppError("Property not found", 404);
    }

    const result = await getAdminPropertyByIdService(propertyId);

    return res.status(200).json({
      success: true,
      message: "Admin property fetched successfully",
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

export const getMyPropertyById = asyncHandler(
  async (req: Request, res: Response) => {
    const propertyId = req.params.id;

    if (!propertyId || Array.isArray(propertyId)) {
      throw new AppError("Property not found", 404);
    }

    const result = await getOwnerPropertyByIdService(req.user!.uid, propertyId);

    return res.status(200).json({
      success: true,
      message: "Owner property fetched successfully",
      data: result,
    });
  },
);

export const updateProperty = asyncHandler(
  async (req: Request, res: Response) => {
    const propertyId = req.params.id;

    if (!propertyId || Array.isArray(propertyId)) {
      throw new AppError("Property not found", 404);
    }

    const result = await updateOwnerPropertyService({
      ownerId: req.user!.uid,
      propertyId,
      input: req.body,
    });

    return res.status(200).json({
      success: true,
      message: "Property updated successfully",
      data: result,
    });
  },
);

export const archiveProperty = asyncHandler(
  async (req: Request, res: Response) => {
    const propertyId = req.params.id;

    if (!propertyId || Array.isArray(propertyId)) {
      throw new AppError("Property not found", 404);
    }

    const result = await archivePropertyService({
      propertyId,
      user: req.user!,
    });

    return res.status(200).json({
      success: true,
      message: "Property archived successfully",
      data: result,
    });
  },
);

export const relistProperty = asyncHandler(
  async (req: Request, res: Response) => {
    const propertyId = req.params.id;

    if (!propertyId || Array.isArray(propertyId)) {
      throw new AppError("Property not found", 404);
    }

    const result = await relistPropertyService({
      propertyId,
      user: req.user!,
    });

    return res.status(200).json({
      success: true,
      message: "Property relisted successfully",
      data: result,
    });
  },
);

export const getArchivedProperties = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await getArchivedPropertiesService();

    return res.status(200).json({
      success: true,
      message: "Archived properties fetched successfully",
      data: result,
    });
  },
);
