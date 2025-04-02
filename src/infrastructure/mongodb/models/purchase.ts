import mongoose from "mongoose";

const Schema = mongoose.Schema;

const PurchaseItemSchema = new Schema({
  eventId: { type: String, required: true },
  eventName: { type: String, required: true },
  eventDate: { type: String, required: true },
  eventImage: { type: String },
  eventVenue: { type: String },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true }
});

const PurchaseSchema = new Schema({
  userId: { type: String, required: true, ref: "User" },
  billingCardId: { type: String, required: true },
  items: [PurchaseItemSchema],
  totalAmount: { type: Number, required: true },
  purchaseDate: { type: Date, default: Date.now }
});

export const PurchaseModel = mongoose.model("PurchaseModel", PurchaseSchema);
