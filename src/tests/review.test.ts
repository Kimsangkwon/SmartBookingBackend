import request from "supertest";
import mongoose from "mongoose";
import app from "../index";
import { ConnectToDb } from "../infrastructure/mongodb/connection";

jest.mock("../ports/rest/middleware/authentication", () => ({
    authenticateToken: (req: any, res: any, next: any) => {
      req.user = { id: "mockUserId", role: "admin" };
      next();
    },
    isAdmin: (req: any, res: any, next: any) => {
      next();
    }
  }));
  

jest.mock("../infrastructure/mongodb/queries/review", () => ({
  createReview: jest.fn().mockImplementation((data) => ({
    ...data,
    _id: "mockReviewId"
  })),
  getApprovedReviewsByEventId: jest.fn().mockResolvedValue([
    { content: "Great!", rating: 5, userName: "UserA" }
  ]),
  updateReviewById: jest.fn().mockImplementation((reviewId, userId, updateData) => {
    if (reviewId === "validReview") return { ...updateData, _id: reviewId };
    return null;
  }),
  deleteReviewById: jest.fn().mockImplementation((reviewId, userId) => {
    return reviewId === "validReview" ? true : false;
  })
}));

describe("📝 Review API", () => {
  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await ConnectToDb();
    }
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it("✅ should submit a review", async () => {
    const res = await request(app).post("/review").send({
      eventId: "event123",
      content: "Amazing event!",
      rating: 5,
      userName: "GuestUser"
    });

    expect(res.status).toBe(201);
    expect(res.body.review).toHaveProperty("eventId", "event123");
    expect(res.body.message).toBe("Review submitted and pending approval");
  });

  it("✅ should get approved reviews for an event", async () => {
    const res = await request(app).get("/review/event123");

    expect(res.status).toBe(200);
    expect(res.body.reviews.length).toBeGreaterThan(0);
    expect(res.body.reviews[0]).toHaveProperty("content");
  });

  it("❌ should return 400 if eventId is missing", async () => {
    const res = await request(app).get("/review/");

    expect(res.status).toBe(404);
  });

  it("✅ should update a review", async () => {
    const res = await request(app).put("/review/validReview").send({
      content: "Updated review!",
      rating: 4
    });

    expect(res.status).toBe(200);
    expect(res.body.updated).toHaveProperty("content", "Updated review!");
    expect(res.body.message).toBe("Review updated and pending approval again");
  });

  it("❌ should return 404 for invalid review update", async () => {
    const res = await request(app).put("/review/invalidReview").send({
      content: "Attempted update",
      rating: 3
    });

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("error", "Review not found or unauthorized");
  });

  it("✅ should delete a review", async () => {
    const res = await request(app).delete("/review/validReview");

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message", "Review deleted");
  });

  it("❌ should return 404 for invalid review deletion", async () => {
    const res = await request(app).delete("/review/invalidReview");

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("error", "Review not found or unauthorized");
  });
});
