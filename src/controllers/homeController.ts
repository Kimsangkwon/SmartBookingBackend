import { fetchEventsByCategory, fetchMostViewedEvents } from "../infrastructure/ticketmasterApi";
import {HomeEvent} from "../infrastructure/mongodb/models/HomeEvent";
export const getHomePageEvents = async () => {
    try {
        const mostViewedData = await fetchMostViewedEvents();
        const mostViewed = mostViewedData.map((event: any) => HomeEvent.fromApiResponse(event));

        const sportsData = await fetchEventsByCategory("sports", 6);
        const sportsEvents = sportsData.map((event: any) => HomeEvent.fromApiResponse(event));

        const concertData = await fetchEventsByCategory("music", 6);
        const concertEvents = concertData.map((event: any) => HomeEvent.fromApiResponse(event));

        return { mostViewed, sportsEvents, concertEvents };
    } catch (error) {
        console.error("❌ Error fetching home page events:", error);
        return { mostViewed: [], sportsEvents: [], concertEvents: [] };
    }
};
