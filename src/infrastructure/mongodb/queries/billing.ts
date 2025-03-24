// src/queries/billing.ts
import { BillingInfoModel } from "../models/billing";

export const createBillingInfo = async (userId: string, billingData: any) => {
  const billing = new BillingInfoModel({ userId, ...billingData });
  return await billing.save();
};

export const getBillingInfosByUserId = async (userId: string) => {
    const cards = await BillingInfoModel.find({ userId });
  
    return cards.map((card) => ({
      id: card._id,
      nameOnCard: card.nameOnCard,
      cardNumber: `**** **** **** ${card.cardNumber.slice(-4)}`,
      expirationDate: card.expirationDate
    }));
  };

export const getBillingInfoById = async (userId: string, id: string) => {
  return await BillingInfoModel.findOne({ userId, _id: id });
};

export const updateBillingInfo = async (userId: string, id: string, updateData: any) => {
  return await BillingInfoModel.findOneAndUpdate({ userId, _id: id }, updateData, {
    new: true,
  });
};

export const deleteBillingInfo = async (userId: string, id: string) => {
  return await BillingInfoModel.findOneAndDelete({ userId, _id: id });
};
