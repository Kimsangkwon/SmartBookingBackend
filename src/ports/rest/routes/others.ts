import { Router } from "express";
import { getOthers } from "../../../controllers/OtherController";

const router = Router();

router.get("/", async (req, res) => {
    try {
        const { city, startDate, endDate, classificationName, keyword } = req.query;

        const filters = { city, startDate, endDate, classificationName, keyword };

        const others = await getOthers(filters);

        res.status(200).json({ others });
    } catch (error) {
        console.error("❌ Error in others route:", error);
        res.status(500).json({ error: "Failed to fetch other events" });
    }
});

export default router;
