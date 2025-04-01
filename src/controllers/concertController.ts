import { fetchConcerts, fetchMostViewedEvents } from "../infrastructure/ticketmasterApi";
import { ConcertEvent } from "../domain/ConcertEvent";

export const getConcerts = async (filters: any) => {
    try {
        const concertData = await fetchConcerts(filters.city, filters.startDate, filters.endDate, filters.genre, filters.keyword);
        const concertEvents = concertData.map((event: any) => ConcertEvent.fromApiResponse(event));
        const mostViewedConcertData = await fetchMostViewedEvents("music");
        const mostViewedConcertEvents = mostViewedConcertData.map((event:any)=>ConcertEvent.fromApiResponse(event));
        
        return {concertEvents, mostViewedConcertEvents};
    } catch (error) {
        console.error("Error fetching concerts in concertController:", error);
        return{concertEvets:[], mostViewedConcertEvents:[]};
    }
};


