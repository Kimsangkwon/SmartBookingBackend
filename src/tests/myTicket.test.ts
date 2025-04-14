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


// ✅ Mock Ticket Queries
jest.mock("../infrastructure/mongodb/queries/myTicket", () => ({
  getUpcomingTickets: jest.fn().mockResolvedValue([
    { eventId: "e1", name: "Future Show" }
  ]),
  getPastTickets: jest.fn().mockResolvedValue([
    { eventId: "e2", name: "Past Show" }
  ]),
  getTicketById: jest.fn().mockImplementation((id) =>
    id === "valid" ? { _id: id, event: "Test Event" } : null
  ),
  deleteTicket: jest.fn().mockImplementation((id, userId) =>
    id === "valid" ? true : null
  )
}));

describe("🎫 My Ticket API", () => {
  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await ConnectToDb();
    }
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it("✅ should return upcoming tickets", async () => {
    const res = await request(app).get("/myTicket/upComming");

    expect(res.status).toBe(200);
    expect(res.body.upcomingTickets).toBeDefined();
    expect(res.body.upcomingTickets.length).toBeGreaterThan(0);
  });

  it("✅ should return past tickets", async () => {
    const res = await request(app).get("/myTicket/past");

    expect(res.status).toBe(200);
    expect(res.body.pastTickets).toBeDefined();
    expect(res.body.pastTickets.length).toBeGreaterThan(0);
  });

  it("✅ should return specific ticket info", async () => {
    const res = await request(app).get("/myTicket/valid");

    expect(res.status).toBe(200);
    expect(res.body.purchase).toBeDefined();
    expect(res.body.purchase._id).toBe("valid");
  });

  it("❌ should return 404 if ticket not found", async () => {
    const res = await request(app).get("/myTicket/invalid");

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Purchase not found");
  });

  it("✅ should delete a ticket", async () => {
    const res = await request(app).delete("/myTicket/valid");

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Purchase cancelled");
  });

  it("❌ should return 404 if deletion fails", async () => {
    const res = await request(app).delete("/myTicket/invalid");

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Purchase not found or unauthorized");
  });
});
