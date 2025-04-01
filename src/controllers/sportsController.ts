import { fetchMostViewedEvents, fetchSports } from "../infrastructure/ticketmasterApi";
import { SportsEvent } from "../domain/sportsEvent";

export const getSports = async (filters: any) => {
    try {
        const sportsData = await fetchSports(filters.city, filters.startDate, filters.endDate, filters.sportType, filters.keyword);
        const sportsEvents = sportsData.map((event: any) => SportsEvent.fromApiResponse(event));
        const mostViewedSportsData = await fetchMostViewedEvents("sport");
        const mostViewedSportEvent = mostViewedSportsData.map((event:any)=>SportsEvent.fromApiResponse(event));
        return {sportsEvents, mostViewedSportEvent}

    } catch (error) {
        console.error("Error fetching sports in sportsController:", error);
        return{sportsEvents:[], mostViewedSportEvent:[]};
    }
};
