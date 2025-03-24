import request from "supertest";
import app from "../index";
import { createPurchase } from "../infrastructure/mongodb/queries/purchase";
import mongoose from "mongoose";

// ✅ Mock middleware
jest.mock("../ports/rest/middleware/authentication", () => ({
  authenticateToken: (req: any, res: any, next: any) => {
    req.user = { id: "mockUserId" };
    next();
  },
}));

jest.mock("../infrastructure/mongodb/queries/purchase");

const mockPurchase = {
  _id: "mockPurchaseId",
  eventName: "Sample Event",
  price: 100,
};

describe("💳 Purchase API", () => {
  afterAll(async () => {
    await mongoose.disconnect(); // ✅ 防止 open handle
  });

  it("✅ should successfully create a purchase", async () => {
    (createPurchase as jest.Mock).mockResolvedValue(mockPurchase);

    const res = await request(app)
      .post("/purchase")
      .send({
        eventId: "event123",
        eventName: "Sample Event",
        eventDate: "2025-01-01",
        eventImage: "image.jpg",
        eventVenue: "Venue A",
        billingCardId: "card123",
        price: 100,
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("purchase");
    expect(res.body.purchase).toEqual(mockPurchase);
  });

  it("❌ should handle error during purchase", async () => {
    (createPurchase as jest.Mock).mockRejectedValue(new Error("DB error"));

    const res = await request(app)
      .post("/purchase")
      .send({
        eventId: "event123",
        eventName: "Sample Event",
        eventDate: "2025-01-01",
        eventImage: "image.jpg",
        eventVenue: "Venue A",
        billingCardId: "card123",
        price: 100,
      });

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty("error", "Failed to process purchase");
  });
});
