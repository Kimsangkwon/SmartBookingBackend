import { getConcerts } from "../controllers/concertController";
import { fetchConcerts } from "../infrastructure/ticketmasterApi";
import { ConcertEvent } from "../infrastructure/mongodb/models/ConcertEvent";

// ✅ Mock dependencies
jest.mock("../infrastructure/ticketmasterApi", () => ({
  fetchConcerts: jest.fn(),
}));

jest.mock("../infrastructure/mongodb/models/ConcertEvent", () => ({
  ConcertEvent: {
    fromApiResponse: jest.fn((event) => ({
      mapped: true,
      ...event,
    })),
  },
}));

describe("🎵 getConcerts()", () => {
  const mockFilters = {
    city: "Toronto",
    startDate: "2024-01-01",
    endDate: "2024-01-02",
    genre: "pop",
    keyword: "concert",
  };

  const mockEvents = [
    { id: "1", name: "Concert A" },
    { id: "2", name: "Concert B" },
  ];

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("✅ should fetch and return mapped concert events", async () => {
    (fetchConcerts as jest.Mock).mockResolvedValue(mockEvents);

    const result = await getConcerts(mockFilters);

    expect(fetchConcerts).toHaveBeenCalledWith(
      mockFilters.city,
      mockFilters.startDate,
      mockFilters.endDate,
      mockFilters.genre,
      mockFilters.keyword
    );

    expect(ConcertEvent.fromApiResponse).toHaveBeenCalledTimes(2);
    expect(result).toEqual([
      { mapped: true, id: "1", name: "Concert A" },
      { mapped: true, id: "2", name: "Concert B" },
    ]);
  });

  it("❌ should throw error when fetchConcerts fails", async () => {
    (fetchConcerts as jest.Mock).mockRejectedValue(new Error("Mocked API failure"));

    await expect(getConcerts(mockFilters)).rejects.toThrow("Failed to fetch concerts");

    expect(fetchConcerts).toHaveBeenCalled();
    expect(ConcertEvent.fromApiResponse).not.toHaveBeenCalled();
  });
});
