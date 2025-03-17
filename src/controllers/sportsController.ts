import { fetchSports } from "../infrastructure/ticketmasterApi";
import { SportsEvent } from "../domain/sportsEvent";

export const getSports = async (filters: any): Promise<SportsEvent[]> => {
    try {
        const events = await fetchSports(filters);
        return events.map((event: any) => SportsEvent.fromApiResponse(event));
    } catch (error) {
        console.error("❌ Error fetching sports in sportsController:", error);
        throw new Error("Failed to fetch sports events");
    }
};
