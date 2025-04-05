import { Router } from "express";
import { Request, Response } from "express";
import { transporter } from "../../../config/email";
import { createPurchase } from "../../../infrastructure/mongodb/queries/guestPurchase";

const router = Router();

router.post("/send-verification", async (req, res) => {
  const { email } = req.body;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Ticketing Email Confirmation",
      text: `Your email ${email} was successfully entered for guest checkout.\n\nEnjoy your event!`,
    });

    res.status(200).json({ message: "Verification email sent for testing." });
  } catch (error) {
    console.error("Error sending guest email verification:", error);
    res.status(500).json({ error: "Failed to send email." });
  }
});

router.post("/purchase", async (req: Request, res: Response) => {
  try {
    const {
      guestEmail,
      billingInfo,
      eventId,
      eventName,
      eventDate,
      eventImage,
      eventVenue,
      quantity,
      price
    } = req.body;

    if (!guestEmail || !billingInfo || !eventId || !eventName || !eventDate || !quantity || !price) {
      return res.status(400).json({ error: "Missing required fields for guest purchase." });
    }

    const totalAmount = quantity * price;

    const newPurchase = await createPurchase({
      guestEmail,
      billingInfo,
      eventId,
      eventName,
      eventDate,
      eventImage,
      eventVenue,
      quantity,
      price,
      totalAmount
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: guestEmail,
      subject: "Your SmartBooking Ticket Confirmation",
      text: `
Thank you for your purchase!

Event: ${eventName}
Venue: ${eventVenue}
Date: ${eventDate}
Price per Ticket: ${price}
Tickets: ${quantity}
Total: $${totalAmount.toFixed(2)}

Your ticket ID: ${newPurchase._id.toString().slice(-8).toUpperCase()}

Please keep this email as proof of your purchase.
      `
    });

    res.status(201).json({ message: "Guest purchase successful", purchase: newPurchase });
  } catch (error) {
    console.error("Error processing guest purchase:", error);
    res.status(500).json({ error: "Failed to process guest purchase" });
  }
});
export default router;
