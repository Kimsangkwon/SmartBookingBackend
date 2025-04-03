import mongoose from "mongoose";
import { PurchaseModel } from "../models/purchase";

export const getUpcomingTickets = async (userId: string) => {
  const now = new Date();
  const purchases = await PurchaseModel.find({
    userId,
    eventDate: { $gte: now.toISOString() }
  }).sort({ eventDate: 1 });

  return purchases.map(p => p.toObject());
};

export const getPastTickets = async (userId: string) => {
  const now = new Date();
  const purchases = await PurchaseModel.find({
    userId,
    eventDate: { $lt: now.toISOString() }
  }).sort({ eventDate: -1 });

  return purchases.map(p => p.toObject());
};


export const getTicketById = async (purchaseId: string) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(purchaseId)) return null;
    const purchase = await PurchaseModel.findById(purchaseId);
    return purchase ? purchase.toObject() : null;
  } catch (error) {
    console.error("Error on getTicketById", error);
    return null;
  }
};

export const deleteTicket = async (purchaseId: string, userId: string) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(purchaseId)) return null;
    const deleted = await PurchaseModel.findOneAndDelete({ _id: purchaseId, userId });
    return deleted ? { deleted: true } : null;
  } catch (error) {
    console.error("Error on deleteTicket", error);
    return null;
  }
};

