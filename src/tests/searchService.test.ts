import { searchEvents } from "../controllers/searchService";
import { fetchEventsFromTicketmaster } from "../infrastructure/ticketmasterApi";
import { Event } from "../infrastructure/mongodb/models/Event";

// Mocks
jest.mock("../infrastructure/ticketmasterApi");
jest.mock("../infrastructure/mongodb/models/Event");

const mockFilters = {
  cityOrPostalCode: "Toronto",
  date: "2024-01-01",
  keyword: "music"
};

const mockApiEvents = [
  { id: "1", name: "Drake Live" },
  { id: "2", name: "The Weeknd Concert" }
];

const mappedEvents = [
  { mapped: true, id: "1" },
  { mapped: true, id: "2" }
];

describe("🔍 searchEvents()", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("✅ should fetch and map events based on filters", async () => {
    (fetchEventsFromTicketmaster as jest.Mock).mockResolvedValue(mockApiEvents);
    (Event.fromApiResponse as jest.Mock).mockImplementation((event) => ({ mapped: true, id: event.id }));

    const result = await searchEvents(mockFilters);

    expect(fetchEventsFromTicketmaster).toHaveBeenCalledWith(mockFilters);
    expect(Event.fromApiResponse).toHaveBeenCalledTimes(2);
    expect(result).toEqual(mappedEvents);
  });
});
