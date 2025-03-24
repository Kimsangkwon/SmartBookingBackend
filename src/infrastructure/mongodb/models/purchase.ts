import mongoose from "mongoose";

const Schema = mongoose.Schema;

const PurchaseSchema = new Schema({
  userId: { type: String, required: true, ref: "User" },
  eventId: { type: String, required: true },
  eventName: { type: String, required: true },
  eventDate: { type: String, required: true },
  eventImage: { type: String },
  eventVenue: { type: String },
  billingCardId: { type: String, required: true },
  price: { type: Number, required: true },
  purchaseDate: { type: Date, default: Date.now }
});

export const PurchaseModel = mongoose.model("PurchaseModel", PurchaseSchema);
