import request from "supertest";
import app from "../app";

describe("GET /api/health", () => {
  it("returns 200 with success true", async () => {
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("API is healthy");
  });
});
