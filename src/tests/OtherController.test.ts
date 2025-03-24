import { getOthers } from "../controllers/OtherController";
import { fetchOthers, fetchMostViewedEvents } from "../infrastructure/ticketmasterApi";
import { OtherEvent } from "../domain/OtherEvent";

jest.mock("../infrastructure/ticketmasterApi");
jest.mock("../domain/OtherEvent");

describe("🎭 OtherController - getOthers", () => {
  const mockFilters = {
    city: "Toronto",
    startDate: "2025-06-01",
    endDate: "2025-06-30",
    classificationName: "",
    keyword: "festival"
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("✅ should return otherEvents and mostViewedOtherEvent", async () => {
    const mockOthers = [
      { id: "1", name: "Other A" },
      { id: "2", name: "Other B" },
    ];

    const mockMostViewedComedy = [{ id: "3", name: "Comedy Star" }];
    const mockMostViewedFamily = [
      { id: "4", name: "Family Fun 1" },
      { id: "5", name: "Family Fun 2" },
    ];
    const mockMostViewedArts = [{ id: "6", name: "Art Expo" }];

    // Mock API responses
    (fetchOthers as jest.Mock).mockResolvedValue(mockOthers);
    (fetchMostViewedEvents as jest.Mock).mockImplementation((category: string) => {
      if (category === "comedy") return Promise.resolve(mockMostViewedComedy);
      if (category === "family") return Promise.resolve(mockMostViewedFamily);
      if (category === "arts") return Promise.resolve(mockMostViewedArts);
      return Promise.resolve([]);
    });

    // Mock fromApiResponse
    (OtherEvent.fromApiResponse as jest.Mock).mockImplementation((event: any) => ({
      mapped: true,
      ...event,
    }));

    const result = await getOthers(mockFilters);

    // ✅ Assert API calls
    expect(fetchOthers).toHaveBeenCalledWith(
      mockFilters.city,
      mockFilters.startDate,
      mockFilters.endDate,
      mockFilters.classificationName,
      mockFilters.keyword
    );

    expect(fetchMostViewedEvents).toHaveBeenCalledTimes(3);
    expect(fetchMostViewedEvents).toHaveBeenCalledWith("comedy", 1);
    expect(fetchMostViewedEvents).toHaveBeenCalledWith("family", 2);
    expect(fetchMostViewedEvents).toHaveBeenCalledWith("arts", 1);

    // ✅ Assert mapper
    expect(OtherEvent.fromApiResponse).toHaveBeenCalledTimes(6); // 2 other + 4 mostViewed

    // ✅ Final result
    expect(result.otherEvents.length).toBe(2);
    expect(result.mostViewedOtherEvent.length).toBe(4);
    expect(result.otherEvents[0]).toHaveProperty("mapped", true);
  });

  it("❌ should throw error if API call fails", async () => {
    (fetchOthers as jest.Mock).mockRejectedValue(new Error("API failure"));

    await expect(getOthers(mockFilters)).rejects.toThrow("Failed to fetch other events");

    expect(fetchOthers).toHaveBeenCalled();
    expect(fetchMostViewedEvents).not.toHaveBeenCalled();
    expect(OtherEvent.fromApiResponse).not.toHaveBeenCalled();
  });
});
