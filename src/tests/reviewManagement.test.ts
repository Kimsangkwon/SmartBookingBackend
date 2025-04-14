import request from "supertest";
import mongoose from "mongoose";
import app from "../index";
import { ConnectToDb } from "../infrastructure/mongodb/connection";

jest.mock("../ports/rest/middleware/authentication", () => ({
  authenticateToken: (req: any, res: any, next: any) => {
    req.user = { id: "adminId", role: "admin" };
    next();
  },
  isAdmin: (req: any, res: any, next: any) => next()
}));

jest.mock("../infrastructure/mongodb/queries/review", () => ({
  getPendingReviews: jest.fn().mockResolvedValue([
    { _id: "r1", content: "Great", status: "pending" }
  ]),
  getAppApprovedReviews: jest.fn().mockResolvedValue([
    { _id: "r2", content: "Nice!", status: "approved" }
  ]),
  approveReviewById: jest.fn().mockImplementation((id) => {
    return id === "r1" ? { _id: id, status: "approved" } : null;
  }),
  declineReviewById: jest.fn().mockImplementation((id) => {
    return id === "r1" ? true : false;
  })
}));

describe("🧾 Admin Review Management API", () => {
  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await ConnectToDb();
    }
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it("✅ should fetch all pending reviews", async () => {
    const res = await request(app).get("/admin/reviews/pending");

    expect(res.status).toBe(200);
    expect(res.body.pendingReviews.length).toBeGreaterThan(0);
  });

  it("✅ should fetch all approved reviews", async () => {
    const res = await request(app).get("/admin/reviews/approved");

    expect(res.status).toBe(200);
    expect(res.body.approvedReviews.length).toBeGreaterThan(0);
  });

  it("✅ should approve review by ID", async () => {
    const res = await request(app).post("/admin/reviews/r1/approve");

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Review approved");
    expect(res.body.review.status).toBe("approved");
  });

  it("❌ should return 404 if approving non-existent review", async () => {
    const res = await request(app).post("/admin/reviews/invalid/approve");

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Review not found");
  });

  it("✅ should decline (delete) review by ID", async () => {
    const res = await request(app).delete("/admin/reviews/r1/decline");

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Review declined and deleted");
  });

  it("❌ should return 404 if declining non-existent review", async () => {
    const res = await request(app).delete("/admin/reviews/invalid/decline");

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Review not found");
  });
});
