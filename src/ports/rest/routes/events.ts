import express, { NextFunction, Response, Request } from "express";
import { ConnectToDb } from "../../../infrastructure/mongodb/connection";
import axios from "axios";
import dependencies from "../../../infrastructure/dependencies";

const router = express.Router();

// Establish database connection
ConnectToDb();

// Extract API configuration from dependencies
const { config } = dependencies;
const { event_api } = config;

// Base URL for Ticketmaster API
const BASE_URL = "https://app.ticketmaster.com/discovery/v2/events.json";

/**
 * Route: GET /list
 * Description: Fetches a list of events from the Ticketmaster API based on user-provided filters such as city, country, and keyword.
 */
router.get("/list", async (req: Request, res: Response) => {
    try {
        // Extract query parameters from request
        const { city, country, keyword, page } = req.query;

        // Define API request parameters
        const params = {
            apikey: event_api, // API key from environment variables
            size: 10, // Limit results to 10 events per request
            page: page || 0, // Set page number (default: 0)
            city: city || "Toronto", // Default city: Toronto
            countryCode: country || "CA", // Default country: Canada (CA)
            keyword: keyword || "", // Search keyword (optional)
        };

        // Make GET request to Ticketmaster API
        const response = await axios.get(BASE_URL, { params });

        // Transform the response data into a cleaner event object array
        const events = response.data._embedded?.events.map((event: any) => ({
            id: event.id, // Event ID
            name: event.name, // Event Name
            date: event.dates?.start?.localDate, // Event Date
            time: event.dates?.start?.localTime, // Event Time
            venue: event._embedded?.venues?.[0]?.name, // Venue Name
            city: event._embedded?.venues?.[0]?.city?.name, // City Name
            country: event._embedded?.venues?.[0]?.country?.name, // Country Name
            image: event.images?.[0]?.url, // Event Image URL
            url: event.url, // Ticketmaster Event URL
        })) || [];

        // Send the transformed event list as a JSON response
        res.status(200).json(events);

    } catch (error) {
        // Handle errors and send a failure response
        console.error("❌ Error fetching events:", error);
        res.status(500).json({ error: "Failed to fetch events" });
    }
});

export = router;
