import { fetchEventsFromTicketmaster } from "../infrastructure/ticketmasterApi";
import { Event } from "../infrastructure/mongodb/models/Event";

export const searchEvents = async (filters: any): Promise<Event[]> => {
    const events = await fetchEventsFromTicketmaster(filters);
    return events.map((event: any) => Event.fromApiResponse(event));
};
