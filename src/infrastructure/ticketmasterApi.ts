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

const formatDateForTicketmaster = (date: string, isEndDate: boolean = false): string => {
    const dateObj = new Date(date);
    if (isEndDate) {
        dateObj.setHours(23, 59, 59);
    } else {
        dateObj.setHours(0, 0, 0);
    }
    return dateObj.toISOString().replace(".000Z", "Z");
};

export const fetchConcerts = async (
    city?: string,
    startDate?: string,
    endDate?: string,
    genre?: string,
    keyword?: string,
    size: number = 100
) => {
    try {
        const params: any = {
            apikey: config.event_api,
            size: size,
            classificationName: "music", 
            sort: "date,asc" 
        };

        if (city) params.city = city;
        if (startDate) params.startDateTime = formatDateForTicketmaster(startDate);
        if (endDate) params.endDateTime = formatDateForTicketmaster(endDate, true);
        if (genre) params.genre = genre;
        if (keyword) params.keyword = keyword;

        const response = await axios.get(BASE_URL, { params });
        return response.data._embedded?.events || [];
    } catch (error) {
        console.error(`❌ Error fetching concerts:`, error);
        return [];
    }
};

export const fetchSports = async (filters: {
    city?: string;
    startDate?: string;
    endDate?: string;
    sportType?: string;
    keyword?: string;
    size?: number;
}) => {
    try {
        const params: any = {
            apikey: config.event_api,
            size: filters.size || 100,
            classificationName: "sports", 
            sort: "date,asc"
        };

        if (filters.city) params.city = filters.city;
        if (filters.startDate) params.startDateTime = formatDateForTicketmaster(filters.startDate);
        if (filters.endDate) params.endDateTime = formatDateForTicketmaster(filters.endDate, true);
        if (filters.sportType) {
            params.keyword = filters.sportType;
        }
        if (filters.keyword) params.keyword = filters.keyword;

        const response = await axios.get(BASE_URL, { params });
        return response.data._embedded?.events || [];
    } catch (error) {
        console.error(`❌ Error fetching sports:`, error);
        return [];
    }
};
