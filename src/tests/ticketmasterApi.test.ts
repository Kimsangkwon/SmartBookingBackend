import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import {
  fetchEventsByUserSearchInputs,
  fetchConcerts,
  fetchSports,
  fetchEventsByCategory,
  fetchMostViewedEvents,
  fetchOthers,
  getEventDetail,
} from "../infrastructure/ticketmasterApi";

const mock = new MockAdapter(axios);

describe("🎫 Ticketmaster API", () => {
  afterEach(() => {
    mock.reset();
  });

  it("✅ fetchEventsByUserSearchInputs returns events", async () => {
    const mockResponse = {
      _embedded: {
        events: [{ id: "1", name: "Sample Event" }],
      },
    };

    mock.onGet().reply(200, mockResponse);

    const filters = { cityOrPostalCode: "Toronto", date: "2025-05-01", keyword: "music" };
    const events = await fetchEventsByUserSearchInputs(filters);

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

  it("✅ fetchOthers returns other categorized events", async () => {
    const mockResponse = {
      _embedded: {
        events: [{ id: "6", name: "Art Exhibition" }],
      },
    };

    mock.onGet().reply(200, mockResponse);

    const events = await fetchOthers("Toronto", "2025-05-01", "2025-05-03", "Arts & Theatre", "painting");

    expect(events).toEqual(mockResponse._embedded.events);
  });

  it("✅ getEventDetail returns single event detail", async () => {
    const mockEvent = { id: "123", name: "Single Event" };

    mock.onGet(/\/123/).reply(200, mockEvent);

    const result = await getEventDetail("123");
    expect(result).toEqual(mockEvent);
  });

  // ❌ Error Handling Tests
  it("❌ fetchConcerts handles API failure", async () => {
    mock.onGet().reply(500);
    const result = await fetchConcerts("Toronto");
    expect(result).toEqual([]);
  });

  it("❌ fetchOthers handles API failure", async () => {
    mock.onGet().reply(500);
    const result = await fetchOthers("Toronto");
    expect(result).toEqual([]);
  });

  it("❌ getEventDetail returns null on error", async () => {
    mock.onGet(/\/456/).reply(500);
    const result = await getEventDetail("456");
    expect(result).toBeNull();
  });
});
