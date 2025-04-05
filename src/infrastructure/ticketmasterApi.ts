import axios from "axios";
import { config } from "../config/config";

// Base URL for Ticketmaster API
const BASE_URL = "https://app.ticketmaster.com/discovery/v2/events";


export const fetchEventsByUserSearchInputs = async (
    cityOrPostalCode?: string,
    date?: string,
    keyword?: string,
) => {
    try {
        const params: any = {
            apikey: config.event_api,
            size: 100,
        };

        if (cityOrPostalCode) {
            if (/^[A-Za-z]\d[A-Za-z][ ]?\d[A-Za-z]\d$/.test(cityOrPostalCode)) {
                params.postalCode = cityOrPostalCode;
            } else {
                params.city = cityOrPostalCode;
            }
        }

        if (date) {
            const startDateTime = `${date}T00:00:00Z`;
            const endDateTime = `${date}T23:59:59Z`;
            params.startDateTime = startDateTime;
            params.endDateTime = endDateTime;
        }

        if (keyword) {
            params.keyword = keyword;
        }

        const response = await axios.get(BASE_URL, { params });
        return response.data._embedded?.events || [];
    } catch (error) {
        console.error("Error fetching events from TicketmasterAPI:", error);
        return [];
    }
};


export const fetchEventsByCategory = async (category: string, size: number = 6) => {
    try {
        const params: any = {
            apikey: config.event_api,
            size: size,
            sort: "date,asc", // Sort events by date in ascending order
            classificationName: category, // Event classification (category)
        };

        const response = await axios.get(BASE_URL, { params });
        return response.data._embedded?.events || [];
    } catch (error) {
        console.error(`Error fetching ${category} events: from TicketmasterAPI`, error);
        return [];
    }
};


export const fetchMostViewedEvents = async (classificationName?:string, size?:number) => {
    try {
        const params: any = {
            apikey: config.event_api,
            size: size || 4, // Return only 4 most popular events
            classificationName: classificationName || "",
            sort: "relevance,desc", // Sort by relevance in descending order
        };

        const response = await axios.get(BASE_URL, { params });
        return response.data._embedded?.events || [];
    } catch (error) {
        console.error("Error fetching most viewed events from TicketmasterAPI:", error);
        return [];
    }
};

const formatDateForTicketmaster = (date: string, isEndDate: boolean = false): string => {
    const dateObj = new Date(date);
    if (isEndDate) {
        dateObj.setHours(23, 59, 59); // Set end time to 23:59:59
    } else {
        dateObj.setHours(0, 0, 0); // Set start time to 00:00:00
    }
    return dateObj.toISOString().replace(".000Z", "Z");
};

export const fetchConcerts = async (city?: string, startDate?: string, endDate?: string, genre?: string, keyword?: string) => {
    try {
        const params: any = {
            apikey: config.event_api,
            size: 100,
            classificationName: "music", // Only fetch music events
            sort: "date,asc", // Sort events by date in ascending order
        };

        if (city) params.city = city;
        if (startDate) params.startDateTime = formatDateForTicketmaster(startDate);
        if (endDate) params.endDateTime = formatDateForTicketmaster(endDate, true);
        if (genre) params.genre = genre;
        if (keyword) params.keyword = keyword;

        const response = await axios.get(BASE_URL, { params });
        return response.data._embedded?.events || [];
    } catch (error) {
        console.error(`Error fetching concerts from TicketmasterAPI:`, error);
        return [];
    }
};


export const fetchSports = async (city?: string, startDate?: string, endDate?: string, sportType?: string, keyword?: string) => {
    try {
        const params: any = {
            apikey: config.event_api,
            size: 100,
            classificationName: "sports", // Only fetch sports events
            sort: "date,asc",
        };

        if (city) params.city = city;
        if (startDate) params.startDateTime = formatDateForTicketmaster(startDate);
        if (endDate) params.endDateTime = formatDateForTicketmaster(endDate, true);
        if (sportType) params.keyword = sportType;
        if (keyword) params.keyword = keyword;

        const response = await axios.get(BASE_URL, { params });
        return response.data._embedded?.events || [];
    } catch (error) {
        console.error(`Error fetching sports from TicketmasterAPI:`, error);
        return [];
    }
};

export const fetchOthers = async ( city?: string, startDate?: string, endDate?: string, classificationName?: string, keyword?: string,) => {
    try {
        const params: any = {
            apikey: config.event_api,
            size: 100,
            sort: "date,asc",
        };

        if (city) params.city = city;
        if (startDate) params.startDateTime = formatDateForTicketmaster(startDate);
        if (endDate) params.endDateTime = formatDateForTicketmaster(endDate, true);
        if (classificationName) {
            params.classificationName = classificationName;
        } else {
            params.classificationName = "Arts & Theatre,Film,Family,Comedy,Fairs & Festivals";
        }        if (keyword) params.keyword = keyword;

        const response = await axios.get(BASE_URL, { params });
        return response.data._embedded?.events || [];
    } catch (error) {
        console.error(`Error fetching other events from TicketmasterAPI:`, error);
        return [];
    }
};


export const fetchEventDetail = async(eventId : any)=> {
    try {
        const response = await axios.get(`${BASE_URL}/${eventId}`, {
            params: { apikey: config.event_api },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching eventDetail from TicketmasterAPI:", error);
        return null;
    }
};
