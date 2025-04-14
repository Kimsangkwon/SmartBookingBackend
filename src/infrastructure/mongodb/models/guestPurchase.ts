import mongoose from "mongoose";

const Schema = mongoose.Schema;

const BillingInfoSchema = new Schema({
  name: { type: String, required: true },
  cardNumber: { type: String, required: true },
  expiration: { type: String, required: true },
  country: { type: String, required: true },
  address1: { type: String, required: true },
  address2: { type: String },
  city: { type: String, required: true },
  province: { type: String, required: true },
  postalCode: { type: String, required: true },
  phone: { type: String, required: true },
});

const GuestPurchaseSchema = new Schema({
  guestEmail: { type: String, required: true },
  billingInfo: { type: BillingInfoSchema, required: true },
  eventId: { type: String, required: true },
  eventName: { type: String, required: true },
  eventDate: { type: String, required: true },
  eventImage: { type: String },
  eventVenue: { type: String },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true }, // unit price
  totalAmount: { type: Number, required: true },
  purchaseDate: { type: Date, default: Date.now }
});

export const GuestPurchaseModel = mongoose.model("GuestPurchaseModel", GuestPurchaseSchema);
