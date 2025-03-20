import axios from "axios";
import { config } from "../config/config";

// Base URL for Ticketmaster API
const BASE_URL = "https://app.ticketmaster.com/discovery/v2/events";

/**
 * 🎫 Fetch events from Ticketmaster API based on filters
 * @param {Object} filters - Filtering criteria (city, postal code, date, keyword)
 * @returns {Array} An array of matching events
 */
export const fetchEventsByUserSearchInputs = async (filters: any) => {
    try {
        const params: any = {
            apikey: config.event_api, // API key
            size: 100, // Limit results to 100 events
        };

        // Determine if input is a city or postal code
        if (filters.cityOrPostalCode) {
            if (/^\d+$/.test(filters.cityOrPostalCode)) {
                params.postalCode = filters.cityOrPostalCode; // If numeric, assume postal code
            } else {
                params.city = filters.cityOrPostalCode; // Otherwise, assume city
            }
        }

        // Format date range to ISO 8601 format
        if (filters.date) {
            const startDateTime = new Date(filters.date).toISOString();
            const endDateTime = new Date(new Date(filters.date).setDate(new Date(filters.date).getDate() + 1)).toISOString();
            params.startDateTime = startDateTime;
            params.endDateTime = endDateTime;
        }

        // Add keyword search if provided
        if (filters.keyword) {
            params.keyword = filters.keyword;
        }

        // Send request to Ticketmaster API
        const response = await axios.get(BASE_URL, { params });
        return response.data._embedded?.events || [];
    } catch (error) {
        console.error("❌ Error fetching events from Ticketmaster:", error);
        throw new Error("Failed to fetch events");
    }
};

/**
 * 🎭 Fetch events by category (e.g., music, sports)
 * @param {string} category - Event category (e.g., "sports", "music")
 * @param {number} size - Number of results to return (default: 6)
 * @returns {Array} An array of matching events
 */
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
        console.error(`❌ Error fetching ${category} events:`, error);
        return [];
    }
};

/**
 * 🔥 Fetch the most viewed events
 * @returns {Array} An array of top 4 most viewed events
 */
export const fetchMostViewedEvents = async (classificationName?:string) => {
    try {
        const params: any = {
            apikey: config.event_api,
            size: 4, // Return only 4 most popular events
            classificationName: classificationName || "",
            sort: "relevance,desc", // Sort by relevance in descending order
        };

        const response = await axios.get(BASE_URL, { params });
        return response.data._embedded?.events || [];
    } catch (error) {
        console.error("❌ Error fetching most viewed events:", error);
        return [];
    }
};

/**
 * 🗓 Format date to ISO 8601 format for Ticketmaster API
 * @param {string} date - Date string to format
 * @param {boolean} isEndDate - Whether this is an end date (default: false)
 * @returns {string} ISO 8601 formatted date
 */
const formatDateForTicketmaster = (date: string, isEndDate: boolean = false): string => {
    const dateObj = new Date(date);
    if (isEndDate) {
        dateObj.setHours(23, 59, 59); // Set end time to 23:59:59
    } else {
        dateObj.setHours(0, 0, 0); // Set start time to 00:00:00
    }
    return dateObj.toISOString().replace(".000Z", "Z");
};

/**
 * 🎵 Fetch concerts based on optional filters
 * @param {string} city - City name
 * @param {string} startDate - Start date (ISO 8601)
 * @param {string} endDate - End date (ISO 8601)
 * @param {string} genre - Genre of music
 * @param {string} keyword - Keyword for search
 * @param {number} size - Number of results (default: 100)
 * @returns {Array} An array of matching concerts
 */
export const fetchConcerts = async (city?: string, startDate?: string, endDate?: string, genre?: string, keyword?: string, size: number = 100) => {
    try {
        const params: any = {
            apikey: config.event_api,
            size: size,
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
        console.error(`❌ Error fetching concerts:`, error);
        return [];
    }
};

/**
 * ⚽ Fetch sports events based on optional filters
 * @param {Object} filters - Filtering criteria (city, start date, end date, sport type, keyword)
 * @returns {Array} An array of matching sports events
 */
export const fetchSports = async (filters: { city?: string; startDate?: string; endDate?: string; sportType?: string; keyword?: string; size?: number }) => {
    try {
        const params: any = {
            apikey: config.event_api,
            size: filters.size || 100,
            classificationName: "sports", // Only fetch sports events
            sort: "date,asc",
        };

        if (filters.city) params.city = filters.city;
        if (filters.startDate) params.startDateTime = formatDateForTicketmaster(filters.startDate);
        if (filters.endDate) params.endDateTime = formatDateForTicketmaster(filters.endDate, true);
        if (filters.sportType) params.keyword = filters.sportType;
        if (filters.keyword) params.keyword = filters.keyword;

        const response = await axios.get(BASE_URL, { params });
        return response.data._embedded?.events || [];
    } catch (error) {
        console.error(`❌ Error fetching sports:`, error);
        return [];
    }
};
/**
 *  Fetch other events based on optional filters
 * @param {Object} filters - Filtering criteria (city, start date, end date, classification, keyword)
 * @returns {Array} An array of matching sports events
 */
export const fetchOthers = async (
    city?: string,
    startDate?: string,
    endDate?: string,
    classificationName?: string,
    keyword?: string,
    size: number = 100
) => {
    try {
        const params: any = {
            apikey: config.event_api,
            size: size,
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
        console.error(`❌ Error fetching other events:`, error);
        return [];
    }
};


export const getEventDetail = async(eventId : any)=> {
    try {
        const response = await axios.get(`${BASE_URL}/${eventId}`, {
            params: { apikey: config.event_api },
        });

        const event = response.data;

        if (!event) {
            return null;
        }

        return event;
    } catch (error) {
        console.error("❌ Error fetching event from Ticketmaster:", error);
        return null;
    }
};
