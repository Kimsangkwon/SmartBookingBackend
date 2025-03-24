import request from "supertest";
import app from "../index";
import * as searchController from "../controllers/searchController";

jest.mock("../controllers/searchController");

describe("🔍 Search API Tests", () => {
  const mockEvents = [
    { id: "1", name: "Event A" },
    { id: "2", name: "Event B" },
  ];

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("✅ Should return filtered events with valid query params", async () => {
    (searchController.searchEvents as jest.Mock).mockResolvedValue(mockEvents);

    const res = await request(app)
      .get("/search")
      .query({ cityOrPostalCode: "Toronto", date: "2025-04-01", keyword: "concert" });

    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockEvents);
    expect(searchController.searchEvents).toHaveBeenCalledWith({
      cityOrPostalCode: "Toronto",
      date: "2025-04-01",
      keyword: "concert",
    });
  });

  it("❌ Should return 500 if search controller throws error", async () => {
    (searchController.searchEvents as jest.Mock).mockRejectedValue(new Error("Mocked error"));

    const res = await request(app)
      .get("/search")
      .query({ cityOrPostalCode: "Toronto", date: "2025-04-01", keyword: "concert" });

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty("error", "Failed to fetch and filter events");
  });
});
