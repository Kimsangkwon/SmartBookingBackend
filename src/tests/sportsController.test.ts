import { getSports } from "../controllers/sportsController";
import { fetchSports } from "../infrastructure/ticketmasterApi";
import { SportsEvent } from "../domain/sportsEvent";

// Mock dependencies
jest.mock("../infrastructure/ticketmasterApi");
jest.mock("../domain/sportsEvent");

const mockFilters = {
  city: "Toronto",
  startDate: "2024-01-01",
  endDate: "2024-01-02",
  sportType: "basketball",
  keyword: "NBA"
};

const mockApiEvents = [
  { id: "1", name: "Raptors Game" },
  { id: "2", name: "Leafs Game" }
];

const mappedEvents = [
  { mapped: true, id: "1" },
  { mapped: true, id: "2" }
];

describe("🏀 getSports()", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("✅ should fetch and return mapped sports events", async () => {
    (fetchSports as jest.Mock).mockResolvedValue(mockApiEvents);
    (SportsEvent.fromApiResponse as jest.Mock).mockImplementation((event) => ({ mapped: true, id: event.id }));

    const result = await getSports(mockFilters);

    expect(fetchSports).toHaveBeenCalledWith(mockFilters);
    expect(SportsEvent.fromApiResponse).toHaveBeenCalledTimes(2);
    expect(result).toEqual(mappedEvents);
  });

  it("❌ should throw an error when fetchSports fails", async () => {
    (fetchSports as jest.Mock).mockRejectedValue(new Error("Mocked sports API failure"));

    await expect(getSports(mockFilters)).rejects.toThrow("Failed to fetch sports events");

    expect(fetchSports).toHaveBeenCalledWith(mockFilters);
    expect(SportsEvent.fromApiResponse).not.toHaveBeenCalled();
  });
});
