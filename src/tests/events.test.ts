import request from "supertest";
import mongoose from "mongoose";
import app from "../index"; 
import { ConnectToDb, DisconnectDb } from "../infrastructure/mongodb/connection";

// Mock environment variables for API key (ensure this is set up in `.env.test`)
const EVENT_API_KEY = process.env.EVENT_API_KEY || "test-api-key";

/**
 * 🛠 Event API Tests
 */
describe("🛠 Event API Tests", () => {
    
    beforeAll(async () => {
        await ConnectToDb(); // Connect to test database
    });

    afterAll(async () => {
        await DisconnectDb(); // Properly close database connection
    });

    /**
     * ✅ Test: Should return a list of events
     */
    it("✅ Should return a list of events", async () => {
        const res = await request(app)
            .get("/events/list")
            .query({ city: "Toronto", country: "CA", keyword: "concert", page: 1 })
            .expect(200);

        expect(res.body).toBeInstanceOf(Array); // Ensure response is an array
        if (res.body.length > 0) {
            expect(res.body[0]).toHaveProperty("id");
            expect(res.body[0]).toHaveProperty("name");
            expect(res.body[0]).toHaveProperty("date");
            expect(res.body[0]).toHaveProperty("venue");
            expect(res.body[0]).toHaveProperty("city");
            expect(res.body[0]).toHaveProperty("country");
            expect(res.body[0]).toHaveProperty("url");
        }
    });

    /**
     * ❌ Test: Should handle API failure gracefully
     */
    it("❌ Should handle API failure gracefully", async () => {
        // Temporarily modify the API key to an invalid one
        process.env.EVENT_API_KEY = "invalid-api-key";

        const res = await request(app)
            .get("/events/list")
            .query({ city: "InvalidCity", country: "ZZ", keyword: "unknown", page: 1 });

        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty("error", "Failed to fetch events");

        // Restore the valid API key
        process.env.EVENT_API_KEY = EVENT_API_KEY;
    });
});
