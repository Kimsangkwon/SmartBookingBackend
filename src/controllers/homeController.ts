import { fetchEventsByCategory, fetchMostViewedEvents } from "../infrastructure/ticketmasterApi";
import {HomeEvent} from "../domain/HomeEvent";
export const getHomePageEvents = async () => {
    try {
        const mostViewedData = await fetchMostViewedEvents();
        const mostViewed = mostViewedData.map((event: any) => HomeEvent.fromApiResponse(event));
        await new Promise(res => setTimeout(res, 300));

        const sportsData = await fetchEventsByCategory("sports", 6);
        const sportsEvents = sportsData.map((event: any) => HomeEvent.fromApiResponse(event));
        await new Promise(res => setTimeout(res, 300));

        const concertData = await fetchEventsByCategory("music", 6);
        const concertEvents = concertData.map((event: any) => HomeEvent.fromApiResponse(event));
        await new Promise(res => setTimeout(res, 300));

        const comedyData= await fetchEventsByCategory("comedy", 1);
        await new Promise(res => setTimeout(res, 300));
        const familyData = await fetchEventsByCategory("family", 2);
        await new Promise(res => setTimeout(res, 300));
        const artsData = await fetchEventsByCategory("arts", 1);


        const othersData = [...comedyData, ...familyData, ...artsData];
        const othersEvent = othersData.map((event:any)=>HomeEvent.fromApiResponse(event));


        return { mostViewed, sportsEvents, concertEvents, othersEvent };
    } catch (error) {
        console.error("❌ Error fetching home page events:", error);
        return { mostViewed: [], sportsEvents: [], concertEvents: [] , othersEvent:[]};
    }
};
