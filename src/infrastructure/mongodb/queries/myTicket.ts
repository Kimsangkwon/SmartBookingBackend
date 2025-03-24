import { PurchaseModel } from "../models/purchase";

export const getUpcomingTickets = async (userId: string) => {
    const now = new Date().toISOString();
    return await PurchaseModel.find({
      userId,
      eventDate: { $gte: now }
    }).sort({ eventDate: 1 });
  };


  export const getPastTickets = async (userId: string) => {
    const now = new Date().toISOString();
    return await PurchaseModel.find({
      userId,
      eventDate: { $lt: now }
    }).sort({ eventDate: -1 });
  };


export const getTicketById = async (id: string) => {
  return await PurchaseModel.findById(id);
};

export const deleteTicket = async (id: string, userId: string) => {
  return await PurchaseModel.findOneAndDelete({ _id: id, userId });
};
