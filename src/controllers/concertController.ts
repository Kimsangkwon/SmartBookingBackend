import { Request, Response } from "express";
import { fetchConcerts, fetchMostViewedEvents } from "../infrastructure/ticketmasterApi";
import { ConcertEvent } from "../domain/ConcertEvent";

export const getConcerts = async (filters: any) => {
    try {
        const { city, startDate, endDate, genre, keyword } = filters;

        const concertData = await fetchConcerts(
            city as string | undefined,
            startDate as string | undefined,
            endDate as string | undefined,
            genre as string | undefined,
            keyword as string | undefined
        );
        const concertEvents = concertData.map((event: any) => ConcertEvent.fromApiResponse(event));
        const mostViewedConcertData = await fetchMostViewedEvents("music");
        const mostViewedConcertEvents = mostViewedConcertData.map((event:any)=>ConcertEvent.fromApiResponse(event));
        
        return {concertEvents, mostViewedConcertEvents};
    } catch (error) {
        console.error("❌ Error fetching concerts in concertController:", error);
        return{concertEvets:[], mostViewedConcertEvents:[]};
    }
};


