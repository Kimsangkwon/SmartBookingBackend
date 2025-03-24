import { Router } from "express";
import { getSports } from "../../../controllers/sportsController";

const router = Router();

//get sports event
router.get("/", async (req, res) => {
    try {
        const { city, startDate, endDate, sportType, keyword } = req.query;

        const filters = { city, startDate, endDate, sportType, keyword };

        const sports = await getSports(filters);

        res.status(200).json({ sports });
    } catch (error) {
        console.error("❌ Error in sports route:", error);
        res.status(500).json({ error: "Failed to fetch sports events" });
    }
});

export default router;
