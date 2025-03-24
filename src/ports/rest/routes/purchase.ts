import { Router } from "express";
import { Request, Response } from "express";
import { authenticateToken } from "../middleware/authentication";
import { createPurchase } from "../../../infrastructure/mongodb/queries/purchase";

const router = Router();

// Purchase ticket for selected event
router.post("/", authenticateToken, async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.id;
      const { eventId, eventName, eventDate, eventImage, eventVenue, billingCardId, price } = req.body;
  
      const newPurchase = await createPurchase({
        userId, eventId, eventName, eventDate, eventImage, eventVenue, billingCardId, price
      });
  
      res.status(201).json({ message: "Purchase successful", purchase: newPurchase });
    } catch (error) {
      console.error("❌ Error creating purchase:", error);
      res.status(500).json({ error: "Failed to process purchase" });
    }
  });

export default router;
