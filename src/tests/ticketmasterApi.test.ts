import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import {
  fetchEventsFromTicketmaster,
  fetchConcerts,
  fetchSports,
  fetchEventsByCategory,
  fetchMostViewedEvents,
} from "../infrastructure/ticketmasterApi";

const mock = new MockAdapter(axios);

describe("🎫 Ticketmaster API", () => {
  afterEach(() => {
    mock.reset();
  });

  it("✅ fetchEventsFromTicketmaster returns events", async () => {
    const mockResponse = {
      _embedded: {
        events: [{ id: "1", name: "Sample Event" }],
      },
    };

    mock.onGet().reply(200, mockResponse);

    const filters = { cityOrPostalCode: "Toronto", date: "2025-05-01", keyword: "music" };
    const events = await fetchEventsFromTicketmaster(filters);

    expect(events).toEqual(mockResponse._embedded.events);
  });

  it("✅ fetchConcerts returns concert events", async () => {
    const mockResponse = {
      _embedded: {
        events: [{ id: "2", name: "Concert Night" }],
      },
    };

    mock.onGet().reply(200, mockResponse);

    const concerts = await fetchConcerts("Toronto", "2025-05-01", "2025-05-02", "rock", "festival");

    expect(concerts).toEqual(mockResponse._embedded.events);
  });

  it("✅ fetchSports returns sports events", async () => {
    const mockResponse = {
      _embedded: {
        events: [{ id: "3", name: "NBA Game" }],
      },
    };

    mock.onGet().reply(200, mockResponse);

    const sports = await fetchSports({ city: "Toronto", startDate: "2025-05-01", keyword: "NBA" });

    expect(sports).toEqual(mockResponse._embedded.events);
  });

  it("✅ fetchEventsByCategory returns categorized events", async () => {
    const mockResponse = {
      _embedded: {
        events: [{ id: "4", name: "Comedy Show" }],
      },
    };

    mock.onGet().reply(200, mockResponse);

    const events = await fetchEventsByCategory("comedy");

    expect(events).toEqual(mockResponse._embedded.events);
  });

  it("✅ fetchMostViewedEvents returns popular events", async () => {
    const mockResponse = {
      _embedded: {
        events: [{ id: "5", name: "Popular Event" }],
      },
    };

    mock.onGet().reply(200, mockResponse);

    const events = await fetchMostViewedEvents();

    expect(events).toEqual(mockResponse._embedded.events);
  });

  it("❌ should handle API error gracefully", async () => {
    mock.onGet().reply(500);

    const result = await fetchConcerts("Toronto");

    expect(result).toEqual([]);
  });
});
