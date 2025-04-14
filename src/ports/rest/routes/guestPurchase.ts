import { Router } from "express";
import { Request, Response } from "express";
import { transporter } from "../../../config/email";
import { createPurchase } from "../../../infrastructure/mongodb/queries/guestPurchase";
import { sendTicketEmail } from "../../../controllers/emailController";

const router = Router();

router.post("/purchase", async (req: Request, res: Response) => {
  try {
    const { guestEmail, billingInfo, eventId, eventName, eventDate, eventImage, eventVenue, quantity, price } = req.body;

    if (!guestEmail || !billingInfo || !eventId || !eventName || !eventDate || !quantity || !price) {
      return res.status(400).json({ error: "Missing required fields for guest purchase." });
    }

    const totalAmount = quantity * price;

    const newPurchase = await createPurchase({ guestEmail, billingInfo, eventId, eventName, eventDate, eventImage, eventVenue, quantity, price, totalAmount });
    //Send confirmation email
    await sendTicketEmail({ userEmail: guestEmail, eventName, eventVenue, eventDate, price, quantity, totalAmount, purchaseId: newPurchase._id.toString(), });
    res.status(201).json({ message: "Guest purchase successful", purchase: newPurchase });
  } catch (error) {
    console.error("Error processing guest purchase:", error);
    res.status(500).json({ error: "Failed to process guest purchase" });
  }
});
export default router;
