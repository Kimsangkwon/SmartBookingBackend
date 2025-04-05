import { GuestPurchaseModel } from "../models/guestPurchase";

export const createPurchase = async (purchaseData: any) => {
  const purchase = new GuestPurchaseModel(purchaseData);
  return await purchase.save();
};

