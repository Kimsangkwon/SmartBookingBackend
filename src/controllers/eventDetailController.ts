import { fetchEventDetail } from "../infrastructure/ticketmasterApi";

export const getEventDetail = async(eventId: string)=>{
    try{
        const eventDetailData = await fetchEventDetail(eventId);
        const randomPrice = Math.floor(Math.random() * (90 - 28 + 1)) + 28; //Random price

        return {...eventDetailData, price:randomPrice};
    }
    catch(error){
        console.error("Error fetching eventDetail in eventDetailController:", error);
        return {eventDetailData:[]};
    }
}