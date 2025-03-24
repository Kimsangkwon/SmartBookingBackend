import request from "supertest";
import mongoose from "mongoose";
import app from "../index"; // 你的 express 应用
import { ConnectToDb } from "../infrastructure/mongodb/connection";

// ✅ Mock getSports from the same path as in the route!
jest.mock("../controllers/sportsController", () => ({
  getSports: jest.fn(),
}));

import { getSports } from "../controllers/sportsController";

jest.setTimeout(20000);

describe("🏅 Sports API Tests", () => {
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

    it("✅ Should return sports events with valid query params", async () => {
        const mockSports = [
            { name: "NBA Game 1", date: "2025-04-01" },
            { name: "NBA Game 2", date: "2025-04-05" },
        ];

        (getSports as jest.Mock).mockResolvedValue(mockSports);

        const res = await request(app)
            .get("/sports")
            .query({
                city: "Toronto",
                startDate: "2025-04-01",
                endDate: "2025-04-30",
                sportType: "basketball",
                keyword: "NBA"
            });

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body.sports)).toBe(true);
        expect(res.body.sports).toEqual(mockSports);
    });

    it("❌ Should handle internal error and return 500", async () => {
        (getSports as jest.Mock).mockRejectedValue(new Error("Mocked error"));

        const res = await request(app)
            .get("/sports")
            .query({
                city: "Toronto",
                startDate: "2025-04-01",
                endDate: "2025-04-30",
                sportType: "basketball",
                keyword: "NBA"
            });

        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty("error", "Failed to fetch sports events");
    });
});
