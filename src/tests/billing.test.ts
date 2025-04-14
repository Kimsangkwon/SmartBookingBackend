import request from "supertest";
import mongoose from "mongoose";
import app from "../index";
import { ConnectToDb } from "../infrastructure/mongodb/connection";

jest.mock("../ports/rest/middleware/authentication", () => ({
  authenticateToken: (req: any, res: any, next: any) => {
    req.user = { id: "mockUserId", role: "admin" };
    next();
  },
  isAdmin: (req: any, res: any, next: any) => {
    next();
  }
}));

// ✅ Mock billing queries
jest.mock("../infrastructure/mongodb/queries/billing", () => ({
  createBillingInfo: jest.fn().mockResolvedValue({ id: "1", cardNumber: "1234567890123456" }),
  getBillingInfosByUserId: jest.fn().mockResolvedValue([
    { id: "1", cardNumber: "1234567890123456" }
  ]),
  getBillingInfoById: jest.fn().mockImplementation((userId, id) =>
    id === "1" ? { id, cardNumber: "1234567890123456" } : null
  ),
  updateBillingInfo: jest.fn().mockImplementation((userId, id, data) =>
    id === "1" ? { id, ...data } : null
  ),
  deleteBillingInfo: jest.fn().mockImplementation((userId, id) => id === "1")
}));

describe("💳 Billing API", () => {
  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await ConnectToDb();
    }
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it("✅ should add billing info", async () => {
    const res = await request(app).post("/billing").send({
      cardNumber: "1234567890123456",
      name: "John Doe"
    });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("message", "Billing info added");
    expect(res.body.billing).toHaveProperty("cardNumber");
  });

  it("✅ should fetch billing info list", async () => {
    const res = await request(app).get("/billing");

    expect(res.status).toBe(200);
    expect(res.body.cards.length).toBeGreaterThan(0);
  });

  it("✅ should get billing info detail by ID", async () => {
    const res = await request(app).get("/billing/1");

    expect(res.status).toBe(200);
    expect(res.body.billing).toHaveProperty("cardNumber");
  });

  it("❌ should return 404 for non-existent billing ID", async () => {
    const res = await request(app).get("/billing/999");

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("message", "Billing info not found");
  });

  it("✅ should update billing info", async () => {
    const res = await request(app).put("/billing/1").send({ cardNumber: "9999888877776666" });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message", "Billing info updated");
    expect(res.body.updated).toHaveProperty("cardNumber", "9999888877776666");
  });

  it("❌ should return 404 when updating non-existent billing info", async () => {
    const res = await request(app).put("/billing/999").send({ cardNumber: "0000111122223333" });

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("message", "Billing info not found");
  });

  it("✅ should delete billing info", async () => {
    const res = await request(app).delete("/billing/1");

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message", "Billing info deleted");
  });

  it("❌ should return 404 when deleting non-existent billing info", async () => {
    const res = await request(app).delete("/billing/999");

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("message", "Billing info not found");
  });
});
