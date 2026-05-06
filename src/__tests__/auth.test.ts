import request from "supertest";
import app from "../app";
import { db } from "../config/firebaseAdmin";

jest.mock("../config/firebaseAdmin", () => ({
  db: {
    collection: jest.fn(),
  },
  admin: {
    firestore: {
      FieldValue: {
        serverTimestamp: jest.fn().mockReturnValue("mock-timestamp"),
      },
    },
  },
}));

describe("POST /api/auth/sync-user", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("creates a user document when user does not exist", async () => {
    // Arrange - setup what firebase will return
    const mockGet = jest.fn().mockResolvedValue({ exists: false });
    const mockSet = jest.fn().mockResolvedValue(undefined);
    const mockDoc = jest.fn().mockReturnValue({ get: mockGet, set: mockSet });
    (db.collection as jest.Mock).mockReturnValue({ doc: mockDoc });

    // Act - make the HTTP Request
    const response = await request(app).post("/api/auth/sync-user").send({
      id: "test-uid-123",
      name: "Test User",
      email: "test@example.com",
    });

    // Assert - check What happened
    expect(response.status).toBe(201);
    expect(mockSet).toHaveBeenCalledWith(
      expect.objectContaining({
        id: "test-uid-123",
        name: "Test User",
        email: "test@example.com",
        role: "owner",
        isApproved: false,
      }),
    );
  });

  it("does not overwrite existing user", async () => {
    // Arrange
    const mockget = jest.fn().mockResolvedValue({ exists: true });
    const mockSet = jest.fn();
    const mockDoc = jest.fn().mockReturnValue({ get: mockget, set: mockSet });
    (db.collection as jest.Mock).mockReturnValue({ doc: mockDoc });

    // Act
    const response = await request(app).post("/api/auth/sync-user").send({
      id: "existing-uid",
      name: "Existing User",
      email: "existing@example.com",
    });

    // Assert
    expect(response.status).toBe(200);
    expect(mockSet).not.toHaveBeenCalled();
  });

  it("returns 400 when required fields are missing", async () => {
    const response = await request(app).post("/api/auth/sync-user").send({
      name: "missing",
    });

    expect(response.status).toBe(400);
  });
});
