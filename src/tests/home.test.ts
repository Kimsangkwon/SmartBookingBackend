import request from "supertest";
import mongoose from "mongoose";
import app from "../index";
import { ConnectToDb } from "../infrastructure/mongodb/connection";

// 🧪 Mock getHomePageEvents from controller
jest.mock("../controllers/homeController", () => ({
  getHomePageEvents: jest.fn(),
}));

import { getHomePageEvents } from "../controllers/homeController";

jest.setTimeout(20000);

describe("🏠 Home API Tests", () => {
  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await ConnectToDb();
    }
  });

  afterAll(async () => {
    if (mongoose.connection.readyState === 1 || mongoose.connection.readyState === 2) {
      await mongoose.disconnect();
      console.log("🔌 Disconnected from MongoDB");
    }
  });

  it("✅ Should return homepage event data successfully", async () => {
    const mockData = [
      { name: "Event 1", type: "Concert" },
      { name: "Event 2", type: "Sport" },
    ];
    (getHomePageEvents as jest.Mock).mockResolvedValue(mockData);

    const res = await request(app).get("/home");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toEqual(mockData);
  });

  it("❌ Should return 500 if controller throws an error", async () => {
    (getHomePageEvents as jest.Mock).mockRejectedValue(new Error("Mocked error"));

    const res = await request(app).get("/home");

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty("error", "Failed to fetch home page events");
  });
});
