import request from "supertest";
import app from "../app";
import { Request, Response, NextFunction } from "express";
import cloudinary from "../config/cloudinary";

jest.mock("../middlewares/requireAuth", () => ({
  requireAuth: (req: Request, res: Response, next: NextFunction) => next(),
  requireRole:
    (...roles: string[]) =>
    (req: Request, res: Response, next: NextFunction) =>
      next(),
}));

jest.mock("../config/cloudinary", () => ({
  __esModule: true,
  default: {
    utils: {
      api_sign_request: jest.fn(),
    },
  },
}));

describe("POST /api/uploads/sign", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns a signature and folder when valid uid is provided", async () => {
    // Arrange
    (cloudinary.utils.api_sign_request as jest.Mock).mockReturnValue(
      "mock-signature",
    );

    // Act
    const response = await request(app).post("/api/uploads/sign").send({
      uid: "sadsddfsdfdf",
      role: "owner",
    });

    // Assert
    expect(response.status).toBe(200);
    expect(response.body.data).toEqual(
      expect.objectContaining({
        signature: "mock-signature",
        folder: `properties/sadsddfsdfdf`,
      }),
    );
  });

  it("returns 400 when uid is missing", async () => {
    const response = await request(app).post("/api/uploads/sign").send({
      role: "owner",
    });

    expect(response.status).toBe(400);
  });
});
