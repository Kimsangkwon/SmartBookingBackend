import request from "supertest";
import mongoose from "mongoose";
import app from "../index";
import User from "../infrastructure/mongodb/models/User";
import { ConnectToDb, DisconnectDb } from "../infrastructure/mongodb/connection";

// Increase Jest timeout to 20 seconds to avoid async issues
jest.setTimeout(20000);

describe("🛠 User API Tests", () => {
    let authToken: string;

    // Ensure database connection before running tests
    beforeAll(async () => {
        if (mongoose.connection.readyState === 0) { // Connect only if not connected
            await ConnectToDb();
        }
        await User.deleteMany(); // Ensure test DB is empty before tests
    });

   // Cleanup database after all tests
    afterAll(async () => {
    await User.deleteMany();

    // Properly close the MongoDB connection if still open
    if (mongoose.connection.readyState === 1 || mongoose.connection.readyState === 2) {
        await mongoose.disconnect();
        console.log("🔌 Disconnected from MongoDB");
    }
});

    
    it("✅ Should successfully register a new user", async () => {
        const res = await request(app)
            .post("/user/create")
            .send({ email: "test@example.com", userPassword: "mypassword" });

        expect(res.status).toBe(201);
        expect(res.body.message).toBe("User registered successfully.");
    });

    it("❌ Should prevent duplicate user registration", async () => {
        const res = await request(app)
            .post("/user/create")
            .send({ email: "test@example.com", userPassword: "mypassword" });

        expect(res.status).toBe(400);
        expect(res.body.error).toBe("User already exists");
    });

    it("✅ Should log in an existing user and return a JWT token", async () => {
        const res = await request(app)
            .post("/user/login")
            .send({ email: "test@example.com", userPassword: "mypassword" });

        expect(res.status).toBe(200);
        expect(res.body.accessToken).toBeDefined();
        authToken = res.body.accessToken;
    });

    it("❌ Should reject login with incorrect password", async () => {
        const res = await request(app)
            .post("/user/login")
            .send({ email: "test@example.com", userPassword: "wrongpassword" });

        expect(res.status).toBe(401);
        expect(res.body.error).toBe("Invalid password");
    });

    it("✅ Should fetch user profile when authenticated", async () => {
        // ✅ Step 1: Ensure no duplicate profiles exist
        await request(app)
            .delete("/user/profile")
            .set("Authorization", `Bearer ${authToken}`);
    
        // ✅ Step 2: Create Profile
        await request(app)
            .post("/user/profile")
            .set("Authorization", `Bearer ${authToken}`)
            .send({
                firstName: "Test",
                lastName: "User",
                uniqueDisplayName: `testuser_${Date.now()}`, // ✅ Ensure unique username
                phoneNumber: "1234567890",
                country: "Canada",
                province: "Ontario",
                city: "Toronto",
                address1: "123 Main St",
                address2: "Apt 4B",
                birthdate: "2000-01-01"
            });
    
        // ✅ Step 3: Fetch the profile
        const res = await request(app)
            .get("/user/profile")
            .set("Authorization", `Bearer ${authToken}`);
    
        console.log("📌 Profile Response:", res.body); // Debugging log
    
        // ✅ Step 4: Validate response
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("firstName", "Test");
        expect(res.body).toHaveProperty("lastName", "User");
    });
    
    
    
    
    it("❌ Should return unauthorized when fetching profile without a token", async () => {
        const res = await request(app).get("/user/profile");
        expect(res.status).toBe(401);
    });
});
