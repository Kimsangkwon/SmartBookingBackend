import request from "supertest";
import app from "../index";
import {
  getUpcomingTickets,
  getPastTickets,
  getTicketById,
  deleteTicket,
} from "../infrastructure/mongodb/queries/myTicket";

// Mock the ticket functions
jest.mock("../infrastructure/mongodb/queries/myTicket");

const mockUserId = "user123";
const mockToken = "mocked-jwt-token"; // This would normally be dynamically generated

// Middleware mock to simulate authentication
jest.mock("../ports/rest/middleware/authentication", () => ({
  authenticateToken: (req: any, res: any, next: any) => {
    req.user = { id: mockUserId };
    next();
  },
}));

describe("🎟️ MyTicket API Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("✅ should fetch upcoming tickets", async () => {
    (getUpcomingTickets as jest.Mock).mockResolvedValue([{ id: "1", name: "Ticket A" }]);

    const res = await request(app).get("/myTicket/upComming").set("Authorization", `Bearer ${mockToken}`);
    expect(res.status).toBe(200);
    expect(res.body.upcomingTickets).toEqual([{ id: "1", name: "Ticket A" }]);
    expect(getUpcomingTickets).toHaveBeenCalledWith(mockUserId);
  });

  it("✅ should fetch past tickets", async () => {
    (getPastTickets as jest.Mock).mockResolvedValue([{ id: "2", name: "Ticket B" }]);

    const res = await request(app).get("/myTicket/past").set("Authorization", `Bearer ${mockToken}`);
    expect(res.status).toBe(200);
    expect(res.body.pastTickets).toEqual([{ id: "2", name: "Ticket B" }]);
    expect(getPastTickets).toHaveBeenCalledWith(mockUserId);
  });

  it("✅ should return ticket detail if found", async () => {
    (getTicketById as jest.Mock).mockResolvedValue({ id: "1", name: "Ticket A" });

    const res = await request(app).get("/myTicket/1").set("Authorization", `Bearer ${mockToken}`);
    expect(res.status).toBe(200);
    expect(res.body.purchase).toEqual({ id: "1", name: "Ticket A" });
    expect(getTicketById).toHaveBeenCalledWith("1");
  });

  it("❌ should return 404 if ticket not found", async () => {
    (getTicketById as jest.Mock).mockResolvedValue(null);

    const res = await request(app).get("/myTicket/999").set("Authorization", `Bearer ${mockToken}`);
    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Purchase not found");
  });

  it("✅ should delete ticket if authorized", async () => {
    (deleteTicket as jest.Mock).mockResolvedValue(true);

    const res = await request(app).delete("/myTicket/1").set("Authorization", `Bearer ${mockToken}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Purchase cancelled");
    expect(deleteTicket).toHaveBeenCalledWith("1", mockUserId);
  });

  it("❌ should return 404 if deletion fails", async () => {
    (deleteTicket as jest.Mock).mockResolvedValue(false);

    const res = await request(app).delete("/myTicket/999").set("Authorization", `Bearer ${mockToken}`);
    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Purchase not found or unauthorized");
  });
});
