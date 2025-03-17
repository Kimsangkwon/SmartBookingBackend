import axios from "axios";
import {config} from "../config/config"

const BASE_URL = "https://app.ticketmaster.com/discovery/v2/events.json";

export const fetchEventsFromTicketmaster = async (filters: any) => {
    try {
        const params: any = {
            apikey: config.event_api,
            size: 100,
        };

        if (filters.cityOrPostalCode) {
            if (/^\d+$/.test(filters.cityOrPostalCode)) {
                params.postalCode = filters.cityOrPostalCode;
            } else {
                params.city = filters.cityOrPostalCode;
            }
        }

        if (filters.date) {
            const startDateTime = new Date(filters.date).toISOString();
            const endDateTime = new Date(new Date(filters.date).setDate(new Date(filters.date).getDate() + 1)).toISOString();
            params.startDateTime = startDateTime;
            params.endDateTime = endDateTime;
        }

        if (filters.keyword) {
            params.keyword = filters.keyword;
        }

        const response = await axios.get(BASE_URL, { params });
        return response.data._embedded?.events || [];
    } catch (error) {
        console.error("❌ Error fetching events from Ticketmaster:", error);
        throw new Error("Failed to fetch events");
    }
};

export const fetchEventsByCategory = async (category: string, size: number = 6) => {
    try {
        const params: any = {
            apikey: config.event_api,
            size: size,
            sort: "date,asc",
            classificationName: category 
        };

        const response = await axios.get(BASE_URL, { params });
        return response.data._embedded?.events || [];
    } catch (error) {
        console.error(`❌ Error fetching ${category} events:`, error);
        return [];
    }
};

export const fetchMostViewedEvents = async () => {
    try {
        const params: any = {
            apikey: config.event_api,
            size: 4,
            sort: "relevance,desc"
        };

        const response = await axios.get(BASE_URL, { params });
        return response.data._embedded?.events || [];
    } catch (error) {
        console.error("❌ Error fetching most viewed events:", error);
        return [];
    }
};