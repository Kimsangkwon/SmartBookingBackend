import { Request, Response, Router } from "express";
import { searchEvents } from "../../../controllers/searchController";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
    try {
        const { cityOrPostalCode, date, keyword } = req.query;
        const filters = { cityOrPostalCode, date, keyword };

        const events = await searchEvents(filters);
        res.status(200).json(events);
    } catch (error) {
        console.error("❌ Error in search controller:", error);
        res.status(500).json({ error: "Failed to fetch and filter events" });
    }
});

export default router;
