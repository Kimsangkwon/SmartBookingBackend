import request from "supertest";
import mongoose from "mongoose";
import app from "../index";
import { ConnectToDb } from "../infrastructure/mongodb/connection";

jest.mock("../controllers/concertController", () => ({
  getConcerts: jest.fn(),
}));

import { getConcerts } from "../controllers/concertController";

describe("🎶 Concerts API", () => {
  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await ConnectToDb();
    }
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it("✅ Should return concert events with valid query params", async () => {
    const mockConcerts = [
      { id: "1", name: "Concert A" },
      { id: "2", name: "Concert B" },
    ];

    (getConcerts as jest.Mock).mockResolvedValue(mockConcerts);

    const res = await request(app)
      .get("/concerts")
      .query({
        city: "Toronto",
        startDate: "2025-04-01",
        endDate: "2025-04-30",
        genre: "rock",
        keyword: "guitar",
      });

    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockConcerts);
    expect(getConcerts).toHaveBeenCalledWith({
      city: "Toronto",
      startDate: "2025-04-01",
      endDate: "2025-04-30",
      genre: "rock",
      keyword: "guitar",
    });
  });

  it("❌ Should return 500 if getConcerts throws error", async () => {
    (getConcerts as jest.Mock).mockRejectedValue(new Error("Mocked failure"));

    const res = await request(app).get("/concerts");

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: "Failed to fetch concerts" });
    expect(getConcerts).toHaveBeenCalled();
  });
});
