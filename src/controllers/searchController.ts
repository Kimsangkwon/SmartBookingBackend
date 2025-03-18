import { fetchEventsByUserSearchInputs } from "../infrastructure/ticketmasterApi";
import { Event } from "../domain/Event";

export const searchEvents = async (filters: any): Promise<Event[]> => {
    const events = await fetchEventsByUserSearchInputs(filters);
    return events.map((event: any) => Event.fromApiResponse(event));
};
