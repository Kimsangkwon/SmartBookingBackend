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
    next(); // allow all for test
  }
}));


// ✅ Mock User Query
jest.mock("../infrastructure/mongodb/queries/user", () => ({
  getAllUsersWithProfiles: jest.fn().mockResolvedValue([
    {
      _id: "u1",
      email: "test1@example.com",
      profile: { fullName: "Test One", phone: "1234567890" }
    },
    {
      _id: "u2",
      email: "test2@example.com",
      profile: { fullName: "Test Two", phone: "0987654321" }
    }
  ])
}));

describe("👥 Admin All Users API", () => {
  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await ConnectToDb();
    }
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it("✅ should return list of all users", async () => {
    const res = await request(app).get("/admin/users");

    expect(res.status).toBe(200);
    expect(res.body.userList).toBeDefined();
    expect(res.body.userList.length).toBe(2);
    expect(res.body.userList[0].email).toBe("test1@example.com");
  });

  it("❌ should return 500 if database fails", async () => {
    const { getAllUsersWithProfiles } = require("../infrastructure/mongodb/queries/user");
    getAllUsersWithProfiles.mockRejectedValueOnce(new Error("DB down"));
  
    const res = await request(app).get("/admin/users");
  
    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty("error", "Failed to fetch user list");
  });
  
});
