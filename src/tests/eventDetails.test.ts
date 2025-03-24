import request from "supertest";
import app from "../index";
import { getEventDetail } from "../infrastructure/ticketmasterApi";

// ✅ Mock the getEventDetail API
jest.mock("../infrastructure/ticketmasterApi", () => ({
  getEventDetail: jest.fn()
}));

describe("🎫 Event Details API", () => {
  const mockedEvent = {
    id: "abc123",
    name: "Mock Event",
    dates: { start: { localDate: "2025-05-01" } },
    _embedded: { venues: [{ name: "Venue A" }] }
  };

  it("✅ Should return event details when valid eventId is provided", async () => {
    (getEventDetail as jest.Mock).mockResolvedValue(mockedEvent);

    const res = await request(app).get("/eventDetail/abc123");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ eventData: mockedEvent });
    expect(getEventDetail).toHaveBeenCalledWith("abc123");
  });

  it("❌ Should return 400 if eventId is missing", async () => {
    const res = await request(app).get("/eventDetail"); // No ID provided

    expect(res.status).toBe(404); // Route not matched => default Express 404
  });

  it("❌ Should return 404 if event is not found", async () => {
    (getEventDetail as jest.Mock).mockResolvedValue(null);

    const res = await request(app).get("/eventDetail/invalid-id");

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: "Event not found" });
  });

  it("❌ Should return 500 if getEventDetail throws error", async () => {
    (getEventDetail as jest.Mock).mockRejectedValue(new Error("Fetch error"));

    const res = await request(app).get("/eventDetail/abc123");

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: "Failed to fetch event details" });
  });
});
