import request from "supertest";
import mongoose from "mongoose";
import app from "../index";
import User from "../infrastructure/mongodb/models/User";
import { ConnectToDb } from "../infrastructure/mongodb/connection";
import { disconnect } from "mongoose";

jest.setTimeout(20000);

describe("🛠 User API Tests", () => {
  let authToken: string;

  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await ConnectToDb();
    }
    await User.deleteMany();
  });

  afterAll(async () => {
    await User.deleteMany();
    if (mongoose.connection.readyState !== 0) {
      await disconnect();
      console.log("🔌 Disconnected from MongoDB");
    }
  });

  it("✅ Should register a new user", async () => {
    const res = await request(app).post("/user/create").send({
      email: "test@example.com",
      userPassword: "mypassword",
    });
    expect(res.status).toBe(201);
    expect(res.body.message).toBe("User registered successfully.");
  });

  it("❌ Should not allow duplicate registration", async () => {
    const res = await request(app).post("/user/create").send({
      email: "test@example.com",
      userPassword: "mypassword",
    });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe("User already exists");
  });

  it("✅ Should login and return JWT token", async () => {
    const res = await request(app).post("/user/login").send({
      email: "test@example.com",
      userPassword: "mypassword",
    });
    expect(res.status).toBe(200);
    expect(res.body.accessToken).toBeDefined();
    authToken = res.body.accessToken;
  });

  it("❌ Should reject login with wrong password", async () => {
    const res = await request(app).post("/user/login").send({
      email: "test@example.com",
      userPassword: "wrongpassword",
    });
    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Invalid password");
  });

  it("❌ Should reject login for non-existent user", async () => {
    const res = await request(app).post("/user/login").send({
      email: "nonexistent@example.com",
      userPassword: "nopassword",
    });
    expect(res.status).toBe(404);
    expect(res.body.error).toBe("User not found");
  });

  it("✅ Should validate JWT token", async () => {
    const res = await request(app)
      .post("/user/checkUserAuthenticated")
      .set("Authorization", `Bearer ${authToken}`);
    expect(res.status).toBe(200);
    expect(res.body.user).toBeDefined();
  });

  it("❌ Should reject checkUserAuthenticated without token", async () => {
    const res = await request(app).post("/user/checkUserAuthenticated");
    expect(res.status).toBe(401);
  });

  it("✅ Should create user profile", async () => {
    const res = await request(app)
      .post("/user/profile")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        firstName: "Test",
        lastName: "User",
        uniqueDisplayName: `testuser_${Date.now()}`,
        phoneNumber: "1234567890",
        country: "Canada",
        province: "Ontario",
        city: "Toronto",
        address1: "123 Main St",
        birthdate: "2000-01-01"
      });
  
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message", "Profile created successfully");
    expect(res.body.profile).toHaveProperty("firstName", "Test");
  });
  

  it("❌ Should reject profile creation with invalid data", async () => {
    const res = await request(app)
      .post("/user/profile")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        firstName: "",
      });
    expect(res.status).toBe(400);
  });

  it("✅ Should fetch user profile with token", async () => {
    const res = await request(app)
      .get("/user/profile")
      .set("Authorization", `Bearer ${authToken}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("firstName");
  });

  it("❌ Should reject profile access without token", async () => {
    const res = await request(app).get("/user/profile");
    expect(res.status).toBe(401);
  });
});
