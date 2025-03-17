import { Request, Response } from "express";
import { fetchConcerts } from "../infrastructure/ticketmasterApi";
import { ConcertEvent } from "../infrastructure/mongodb/models/ConcertEvent";

export const getConcerts = async (filters: any): Promise<ConcertEvent[]> => {
    try {
        const { city, startDate, endDate, genre, keyword } = filters;

        const events = await fetchConcerts(
            city as string | undefined,
            startDate as string | undefined,
            endDate as string | undefined,
            genre as string | undefined,
            keyword as string | undefined
        );

        return events.map((event: any) => ConcertEvent.fromApiResponse(event));
    } catch (error) {
        console.error("❌ Error fetching concerts in concertController:", error);
        throw new Error("Failed to fetch concerts");
    }
};


