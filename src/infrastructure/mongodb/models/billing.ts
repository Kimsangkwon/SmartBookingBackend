import mongoose from "mongoose";
const Schema = mongoose.Schema;

const BillingInfoSchema = new Schema({
  userId: { type: String, required: true, ref: "User" },
  nameOnCard: { type: String, required: true },
  cardNumber: { type: String, required: true },
  expirationDate: { type: String, required: true },
  country: { type: String, required: true },
  address1: { type: String, required: true },
  address2: { type: String }, // optional
  city: { type: String, required: true },
  province: { type: String, required: true },
  postalCode: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export const BillingInfoModel = mongoose.model("BillingInfo", BillingInfoSchema);
