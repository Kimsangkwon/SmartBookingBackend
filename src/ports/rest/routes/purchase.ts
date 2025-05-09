import { Router } from "express";
import { Request, Response } from "express";
import { authenticateToken } from "../middleware/authentication";
import { createPurchase } from "../../../infrastructure/mongodb/queries/purchase";
import { sendTicketEmail } from "../../../controllers/emailController";

const router = Router();

// Purchase ticket for selected event
router.post("/", authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const userEmail = (req as any).user.email;
    const { billingCardId, eventId, eventName, eventDate, eventImage, eventVenue, quantity, price } = req.body;

    if (!eventId || !eventName || !eventDate || !quantity || !price || !billingCardId) {
      return res.status(400).json({ error: "Missing required fields for purchase." });
    }
    //calculate total amount
    const totalAmount = quantity * price;
    const newPurchase = await createPurchase({ userId, billingCardId, eventId, eventName, eventDate, eventImage, eventVenue, quantity, price, totalAmount });
    //Send confirmation email
    await sendTicketEmail({ userEmail, eventName, eventVenue, eventDate, price, quantity, totalAmount, purchaseId: newPurchase._id.toString(), })

    res.status(201).json({ message: "Purchase successful", purchase: newPurchase });
  } catch (error) {
    console.error("Error creating purchase:", error);
    res.status(500).json({ error: "Failed to process purchase" });
  }
});

export default router;
