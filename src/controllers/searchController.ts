import { fetchEventsByUserSearchInputs } from "../infrastructure/ticketmasterApi";
import { Event } from "../domain/Event";

export const searchEvents = async (filters:any) => {
    try{
        const events = await fetchEventsByUserSearchInputs(filters.cityOrPostalCode, filters.date, filters.keyword);
        return events.map((event: any) => Event.fromApiResponse(event));
    }
    catch(error){
        console.error("Error fetching concerts in searchController:", error);
        return{searchEvents:[]};
    }

};
