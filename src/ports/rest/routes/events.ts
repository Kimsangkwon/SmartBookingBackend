import express, { NextFunction, Response, Request } from "express";
import { ConnectToDb } from "../../../infrastructure/mongodb/connection";
import axios from "axios";
import dependencies from "../../../infrastructure/dependencies";


const router = express.Router();

ConnectToDb();
const {config} = dependencies;
const {event_api} = config;
const BASE_URL = "https://app.ticketmaster.com/discovery/v2/events.json";

router.get("/list", async (req, res) => {
    try {
        const { city, country, keyword, page } = req.query;
        const params = {
            apikey: event_api,
            size: 10, 
            page: page || 0,
            city: city || "Toronto", 
            countryCode: country || "CA", 
            keyword: keyword || "", 
        };

        const response = await axios.get(BASE_URL, { params });

        const events = response.data._embedded?.events.map((event:any) => ({
            id: event.id,
            name: event.name,
            date: event.dates?.start?.localDate,
            time: event.dates?.start?.localTime,
            venue: event._embedded?.venues?.[0]?.name,
            city: event._embedded?.venues?.[0]?.city?.name,
            country: event._embedded?.venues?.[0]?.country?.name,
            image: event.images?.[0]?.url,
            url: event.url,
        })) || [];

        res.status(200).json(events);
    } catch (error) {
        console.error("❌ Error fetching events:", error);
        res.status(500).json({ error: "Failed to fetch events" });
    }
});


export = router;


