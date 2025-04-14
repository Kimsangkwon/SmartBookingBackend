import { transporter } from "../config/email";

export const sendTicketEmail = async ({ userEmail, eventName, eventVenue, eventDate, price, quantity, totalAmount, purchaseId,
}: {
    userEmail: string; eventName: string; eventVenue: string; eventDate: string; price: number; quantity: number; totalAmount: number; purchaseId: string;
}) => {
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: userEmail,
        subject: "Your SmartBooking Ticket Confirmation",
        text: `
  Thank you for your purchase!
  
  Event: ${eventName}
  Venue: ${eventVenue}
  Date: ${eventDate}
  Price per Ticket: ${price}
  Tickets: ${quantity}A
  Total: $${totalAmount.toFixed(2)}
  
  Your ticket ID: ${purchaseId.slice(-8).toUpperCase()}
  
  Please keep this email as proof of your purchase.
      `
    });
};