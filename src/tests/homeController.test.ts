import { getHomePageEvents } from "../controllers/homeController";
import { fetchEventsByCategory, fetchMostViewedEvents } from "../infrastructure/ticketmasterApi";
import { HomeEvent } from "../infrastructure/mongodb/models/HomeEvent";

jest.mock("../infrastructure/ticketmasterApi");
jest.mock("../infrastructure/mongodb/models/HomeEvent");

const mockEvent = { id: "1", name: "Event 1" };
const mockMappedEvent = { mapped: true };

describe("🏠 getHomePageEvents()", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("✅ should return mapped home page events", async () => {
    (fetchMostViewedEvents as jest.Mock).mockResolvedValue([mockEvent]);
    (fetchEventsByCategory as jest.Mock).mockResolvedValue([mockEvent]);
    (HomeEvent.fromApiResponse as jest.Mock).mockReturnValue(mockMappedEvent);

    const result = await getHomePageEvents();

    expect(fetchMostViewedEvents).toHaveBeenCalled();
    expect(fetchEventsByCategory).toHaveBeenCalledTimes(2);
    expect(result).toEqual({
      mostViewed: [mockMappedEvent],
      sportsEvents: [mockMappedEvent],
      concertEvents: [mockMappedEvent]
    });
  });

  it("❌ should return empty arrays when API throws error", async () => {
    (fetchMostViewedEvents as jest.Mock).mockRejectedValue(new Error("API Error"));

    const result = await getHomePageEvents();

    expect(fetchMostViewedEvents).toHaveBeenCalled();
    expect(result).toEqual({
      mostViewed: [],
      sportsEvents: [],
      concertEvents: []
    });
  });
});
