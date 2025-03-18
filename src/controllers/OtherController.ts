import { fetchOthers } from "../infrastructure/ticketmasterApi";
import { OtherEvent } from "../domain/OtherEvent";

export const getOthers = async (filters: any): Promise<OtherEvent[]> => {
    try {
        const events = await fetchOthers(filters.city, filters.startDate, filters.endDate, filters.classificationName,filters.keyword);
        return events.map((event: any) => OtherEvent.fromApiResponse(event));
    } catch (error) {
        console.error("❌ Error fetching other events in othersController:", error);
        throw new Error("Failed to fetch other events");
    }
};