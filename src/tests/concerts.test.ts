import request from "supertest";
import mongoose from "mongoose";
import app from "../index";
import { ConnectToDb } from "../infrastructure/mongodb/connection";

jest.mock("../controllers/concertController", () => ({
  getConcerts: jest.fn(),
}));

import { getConcerts } from "../controllers/concertController";

describe("🎸 Concerts API Tests", () => {
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

  it("✅ Should return concert events with valid query params", async () => {
    const mockConcerts = [
      { id: 1, name: "Concert A" },
      { id: 2, name: "Concert B" },
    ];
  
    (getConcerts as jest.Mock).mockResolvedValue(mockConcerts);
  
    const res = await request(app)
      .get("/concerts")
      .query({
        city: "Toronto",
        startDate: "2025-04-01",
        endDate: "2025-04-30",
        genre: "rock",
        keyword: "guitar"
      });
  
    expect(res.status).toBe(200);
  
    // ✅ Fix these two lines:
    expect(Array.isArray(res.body.concerts)).toBe(true);
    expect(res.body.concerts).toEqual(mockConcerts);
  });
  

  it("❌ Should handle internal error and return 500", async () => {
    (getConcerts as jest.Mock).mockRejectedValue(new Error("Mocked error"));

    const res = await request(app)
      .get("/concerts")
      .query({
        city: "Toronto",
        startDate: "2025-04-01",
        endDate: "2025-04-30",
        genre: "pop",
        keyword: "music"
      });

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty("error", "Failed to fetch concerts");
  });
});
