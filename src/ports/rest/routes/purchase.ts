import { Router } from "express";
import { Request, Response } from "express";
import { authenticateToken } from "../middleware/authentication";
import { createPurchase } from "../../../infrastructure/mongodb/queries/purchase";

const router = Router();

// Purchase ticket for selected event
router.post("/", authenticateToken, async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.id;
      const { billingCardId, items } = req.body;
  
      // items: [{ eventId, eventName, eventDate, eventImage, eventVenue, quantity, price }]
      if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: "No items to purchase." });
      }

      //calculate total amount
      const totalAmount = items.reduce((sum, item) => sum + item.quantity * item.price, 0);
      const newPurchase = await createPurchase({
        userId,
        billingCardId,
        items,
        totalAmount
      });
  
      res.status(201).json({ message: "Purchase successful", purchase: newPurchase });
    } catch (error) {
      console.error("Error creating purchase:", error);
      res.status(500).json({ error: "Failed to process purchase" });
    }
  });

export default router;
