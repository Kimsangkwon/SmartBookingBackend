import request from "supertest";
import mongoose from "mongoose";
import app from "../index";
import { ConnectToDb } from "../infrastructure/mongodb/connection";

// ✅ Mock authentication middleware
jest.mock("../ports/rest/middleware/authentication", () => ({
  authenticateToken: (req: any, res: any, next: any) => {
    req.user = { id: "mockUserId" };
    next();
  }
}));

jest.mock("../ports/rest/middleware/authentication", () => ({
    authenticateToken: (req: any, res: any, next: any) => {
      req.user = { id: "mockUserId", role: "admin" }; 
      next();
    },
    isAdmin: (req: any, res: any, next: any) => {
      next(); 
    }
  }));
  

// ✅ Mock Cart Query functions
jest.mock("../infrastructure/mongodb/queries/cart", () => ({
  createCartItem: jest.fn().mockImplementation((userId, data) => {
    if (data.eventId === "event123") {
      return { alreadyExists: false, cart: { id: "1", ...data } };
    } else {
      return { alreadyExists: true, cart: { id: "2", ...data } };
    }
  }),
  getCartByUserId: jest.fn().mockResolvedValue([
    {
      id: "1",
      eventId: "event123",
      name: "Concert",
      price: 100,
      quantity: 1
    }
  ]),
  deleteCartItem: jest.fn().mockImplementation((userId, eventId) => {
    return eventId === "event123" ? { eventId } : null;
  })
}));

describe("🛒 Cart API", () => {
  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await ConnectToDb();
    }
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it("✅ should add item to cart", async () => {
    const res = await request(app)
      .post("/cart")
      .send({
        eventId: "event123",
        name: "Concert",
        date: "2025-05-01",
        image: "image.jpg",
        venue: "Arena",
        price: 100,
        quantity: 1
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("message", "Event added to cart");
    expect(res.body.cart).toHaveProperty("eventId", "event123");
  });

  it("❌ should not add duplicate cart item", async () => {
    const res = await request(app)
      .post("/cart")
      .send({
        eventId: "event999", // mocked as alreadyExists: true
        name: "Test Event",
        date: "2025-05-02",
        image: "image2.jpg",
        venue: "Theatre",
        price: 150,
        quantity: 1
      });

    expect(res.status).toBe(409);
    expect(res.body).toHaveProperty("message", "This event is already in your cart.");
  });

  it("✅ should get cart items for user", async () => {
    const res = await request(app).get("/cart");

    expect(res.status).toBe(200);
    expect(res.body.cart).toBeDefined();
    expect(res.body.cart.length).toBeGreaterThan(0);
    expect(res.body.cart[0]).toHaveProperty("eventId", "event123");
  });

  it("✅ should delete a cart item", async () => {
    const res = await request(app).delete("/cart/event123");

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message", "Event removed from cart");
  });

  it("❌ should return 404 when deleting non-existent cart item", async () => {
    const res = await request(app).delete("/cart/event999");

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("message", "Event not found in cart");
  });
});
