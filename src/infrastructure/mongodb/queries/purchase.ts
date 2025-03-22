import { PurchaseModel } from "../models/purchase";

export const createPurchase = async (purchaseData: any) => {
  const purchase = new PurchaseModel(purchaseData);
  return await purchase.save();
};

