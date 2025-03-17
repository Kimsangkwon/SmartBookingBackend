import { Request, Response, Router } from "express";
import {getConcerts} from "../../../controllers/concertController";
const router = Router();


router.get("/", async (req: Request, res: Response) => {
    try {
        const { city, startDate, endDate, genre, keyword } = req.query;

        const filters  = { city, startDate, endDate, genre, keyword };
        const concerts = await getConcerts(filters);
        res.status(200).json({ concerts });
    } catch (error) {
        console.error("❌ Error in concerts controller:", error);
        res.status(500).json({ error: "Failed to fetch concerts" });
    }
});

export default router;
