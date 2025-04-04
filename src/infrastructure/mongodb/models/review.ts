import mongoose from "mongoose";

const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
  userId: { type: String, required: true, ref: "User" },
  eventId: { type: String, required: true },
  userName: { type: String, required: true },
  content: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  createdAt: { type: Date, default: Date.now },
  approved: { type: Boolean, default: false }
});

export const ReviewModel = mongoose.model("ReviewModel", ReviewSchema);