import { fetchEventsByCategory, fetchMostViewedEvents, fetchOthers } from "../infrastructure/ticketmasterApi";
import { OtherEvent } from "../domain/OtherEvent";

export const getOthers = async (filters: any) => {
    try {
        const otherData = await fetchOthers(filters.city, filters.startDate, filters.endDate, filters.classificationName,filters.keyword);
        await new Promise(res => setTimeout(res, 300));
        const otherEvents = otherData.map((event: any) => OtherEvent.fromApiResponse(event));
        
        const mostViewedComedyData= await fetchMostViewedEvents("comedy", 1);
        await new Promise(res => setTimeout(res, 300));
        const mostViewedFamilyData = await fetchMostViewedEvents("family", 2);
        await new Promise(res => setTimeout(res, 300));
        const mostViewedArtsData = await fetchMostViewedEvents("arts", 1);
        const mostViewedOthersData = [...mostViewedComedyData, ...mostViewedFamilyData, ...mostViewedArtsData];
        const mostViewedOtherEvent = mostViewedOthersData.map((event:any)=>OtherEvent.fromApiResponse(event));

        return {otherEvents, mostViewedOtherEvent}
    } catch (error) {
        console.error("❌ Error fetching other events in othersController:", error);
        throw new Error("Failed to fetch other events");
    }
};