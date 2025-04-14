import request from "supertest";
import mongoose from "mongoose";
import app from "../index";
import { ConnectToDb } from "../infrastructure/mongodb/connection";

jest.mock("../ports/rest/middleware/authentication", () => ({
    authenticateToken: (req: any, res: any, next: any) => {
      req.user = { id: "admin123", role: "admin" };
      next();
    },
    isAdmin: (req: any, res: any, next: any) => {
      next();
    }
  }));
  

  jest.mock("../infrastructure/mongodb/models/purchase", () => ({
    PurchaseModel: {
      find: jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValue([
          { _id: "1", userId: { email: "user1@test.com" }, totalAmount: 100 }
        ])
      })
    }
  }));
  
  jest.mock("../infrastructure/mongodb/models/guestPurchase", () => ({
    GuestPurchaseModel: {
      find: jest.fn().mockResolvedValue([
        { _id: "2", guestEmail: "guest1@test.com", totalAmount: 80 }
      ])
    }
  }));
  
  
  

describe("📦 Admin All Purchases API", () => {
  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await ConnectToDb();
    }
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it("✅ should return all user and guest purchases", async () => {
    const res = await request(app).get("/admin/purchases");

    expect(res.status).toBe(200);
    expect(res.body.userPurchases).toBeDefined();
    expect(res.body.guestPurchases).toBeDefined();
    expect(res.body.userPurchases[0].userId.email).toBe("user1@test.com");
  });

  it("❌ should return 500 if database error occurs", async () => {
    const { PurchaseModel } = require("../infrastructure/mongodb/models/purchase");
    PurchaseModel.find.mockImplementationOnce(() => {
      throw new Error("Database failure");
    });
  
    const res = await request(app).get("/admin/purchases");
  
    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty("error", "Failed to fetch purchases");
  });
  
});
