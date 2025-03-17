import { Request, Response, Router } from "express";
import { getHomePageEvents } from "../../../controllers/homeController";

const router = Router();


router.get("/", async (req: Request, res: Response) => {
    try {
        const data = await getHomePageEvents();
        res.status(200).json(data);
    } catch (error) {
        console.error("❌ Error in home controller:", error);
        res.status(500).json({ error: "Failed to fetch home page events" });
    }
});

export default router;
