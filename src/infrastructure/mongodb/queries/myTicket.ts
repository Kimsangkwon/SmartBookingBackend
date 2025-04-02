import mongoose from "mongoose";
import { PurchaseModel } from "../models/purchase";

export const getUpcomingTickets = async (userId: string) => {
  const purchases = await PurchaseModel.find({ userId });

  let events: any[] = [];

  for (const purchase of purchases) {
    for (const item of purchase.items) {
      if (new Date(item.eventDate) >= new Date()) {
        events.push({
          ...item.toObject(), 
          purchaseId: purchase._id,
          billingCardId: purchase.billingCardId,
          totalAmount: purchase.totalAmount,
          purchaseDate: purchase.purchaseDate,
          userId: purchase.userId,
        });
      }
    }
  }

  return events;
};

export const getPastTickets = async (userId: string) => {
  const purchases = await PurchaseModel.find({ userId });

  let events: any[] = [];

  for (const purchase of purchases) {
    for (const item of purchase.items) {
      if (new Date(item.eventDate) < new Date()) {
        events.push({
          ...item.toObject(), 
          purchaseId: purchase._id,
          billingCardId: purchase.billingCardId,
          totalAmount: purchase.totalAmount,
          purchaseDate: purchase.purchaseDate,
          userId: purchase.userId,
        });
      }
    }
  }

  return events;
};


export const getTicketById = async (purchaseId: string, eventId: string) => {
  const purchase = await PurchaseModel.findById(purchaseId);
  if (!purchase) return null;

  const item = purchase.items.find((i: any) => i.eventId === eventId);
  if (!item) return null;

  return {
    ...item.toObject(),
    purchaseId: purchase._id,
    billingCardId: purchase.billingCardId,
    totalAmount: purchase.totalAmount,
    purchaseDate: purchase.purchaseDate,
    userId: purchase.userId,
  };
};

export const deleteTicket = async (
  purchaseId: string,
  eventId: string,
  userId: string,
  confirmDeleteAll: boolean
) => {
  const purchase = await PurchaseModel.findOne({ _id: purchaseId, userId });
  if (!purchase) return null;

  const item = purchase.items.find((i: any) => i.eventId === eventId);
  if (!item) return null;

  // if user delete an event that is the only event in a purchase
  if (purchase.items.length === 1 || confirmDeleteAll) {
    await purchase.deleteOne();
    return { deleted: true, message: "Entire purchase deleted" };
  }

  // if there is more than 2 event in a purchase
  return {
    confirmRequired: true,
    message: "This ticket was purchased with others. Deleting it will remove all tickets in this purchase. Confirm to proceed.",
  };
};

