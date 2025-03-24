import request from "supertest";
import mongoose from "mongoose";
import app from "../index";
import { ConnectToDb } from "../infrastructure/mongodb/connection";

// ✅ Mock searchEvents from controller
jest.mock("../controllers/searchService", () => ({
  searchEvents: jest.fn(),
}));

import { searchEvents } from "../controllers/searchService";

jest.setTimeout(20000);

describe("🔍 Search API Tests", () => {
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

  it("✅ Should return filtered events with valid query params", async () => {
    const mockEvents = [
      { name: "Filtered Event A", city: "Toronto" },
      { name: "Filtered Event B", city: "Toronto" },
    ];

    (searchEvents as jest.Mock).mockResolvedValue(mockEvents);

    const res = await request(app)
      .get("/search")
      .query({
        cityOrPostalCode: "Toronto",
        date: "2025-04-01",
        keyword: "Music"
      });

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toEqual(mockEvents);
  });

  it("❌ Should return 500 if search controller throws error", async () => {
    (searchEvents as jest.Mock).mockRejectedValue(new Error("Mocked error"));

    const res = await request(app)
      .get("/search")
      .query({
        cityOrPostalCode: "Toronto",
        date: "2025-04-01",
        keyword: "Music"
      });

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty("error", "Failed to fetch and filter events");
  });
});
