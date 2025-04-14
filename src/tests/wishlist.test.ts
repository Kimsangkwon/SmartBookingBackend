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


// ✅ Mock Wishlist Queries
jest.mock("../infrastructure/mongodb/queries/wishlist", () => ({
  createWishlistItem: jest.fn().mockImplementation((userId, data) => ({
    _id: "w1",
    userId,
    ...data
  })),
  getWishlistByUserId: jest.fn().mockResolvedValue([
    { eventId: "e1", name: "Event One", venue: "Venue A" }
  ]),
  deleteWishlistItem: jest.fn().mockImplementation((userId, eventId) => {
    return eventId === "e1" ? true : null;
  })
}));

describe("🌟 Wishlist API", () => {
  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await ConnectToDb();
    }
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it("✅ should add item to wishlist", async () => {
    const res = await request(app).post("/wishlist").send({
      eventId: "e1",
      name: "Test Event",
      date: "2025-05-01",
      image: "image.jpg",
      venue: "Test Venue"
    });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("message", "Event added to wishlist");
    expect(res.body.wishlist).toHaveProperty("eventId", "e1");
  });

  it("✅ should fetch wishlist items", async () => {
    const res = await request(app).get("/wishlist");

    expect(res.status).toBe(200);
    expect(res.body.wishlist.length).toBeGreaterThan(0);
    expect(res.body.wishlist[0]).toHaveProperty("name");
  });

  it("✅ should delete item from wishlist", async () => {
    const res = await request(app).delete("/wishlist/e1");

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message", "Event removed from wishlist");
  });

  it("❌ should return 404 if item not found in wishlist", async () => {
    const res = await request(app).delete("/wishlist/unknown");

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("message", "Event not found in wishlist");
  });
});
