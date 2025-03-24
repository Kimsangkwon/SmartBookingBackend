import { Router } from "express";
import { getEventDetail } from "../../../infrastructure/ticketmasterApi";

const router = Router();
//get event detail
router.get("/:eventId", async (req, res) => {
    const { eventId } = req.params;
    if (!eventId) {
        return res.status(400).json({ error: "Event ID is required" });
    }
    try {
        const eventData = await getEventDetail(eventId);

        if (!eventData) {
            return res.status(404).json({ error: "Event not found" });
        }

        res.status(200).json({ eventData });
    } catch (error) {
        console.error("❌ Error in detail route:", error);
        res.status(500).json({ error: "Failed to fetch event details" });
    }
});

export default router;
