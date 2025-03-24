import request from "supertest";
import express from "express";
import othersRoutes from "../ports/rest/routes/others";
import * as OtherController from "../controllers/OtherController";

const app = express();
app.use(express.json());
app.use("/others", othersRoutes);

jest.mock("../controllers/OtherController");

describe("🎭 Others Route API", () => {
  const mockData = {
    otherEvents: [{ id: "1", name: "Fair" }, { id: "2", name: "Theatre" }],
    mostViewedOtherEvent: [{ id: "3", name: "Top Comedy" }],
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("✅ Should return other events when valid query is sent", async () => {
    (OtherController.getOthers as jest.Mock).mockResolvedValue(mockData);

    const res = await request(app).get("/others").query({
      city: "Toronto",
      startDate: "2025-05-01",
      endDate: "2025-05-02",
      classificationName: "Family",
      keyword: "Kids",
    });

    expect(res.status).toBe(200);
    expect(res.body.others).toEqual(mockData);
    expect(OtherController.getOthers).toHaveBeenCalledWith({
      city: "Toronto",
      startDate: "2025-05-01",
      endDate: "2025-05-02",
      classificationName: "Family",
      keyword: "Kids",
    });
  });

  it("❌ Should return 500 if controller throws error", async () => {
    (OtherController.getOthers as jest.Mock).mockRejectedValue(new Error("API Error"));

    const res = await request(app).get("/others");

    expect(res.status).toBe(500);
    expect(res.body.error).toBe("Failed to fetch other events");
  });
});
