import request from "supertest";
import mongoose from "mongoose";
import app from "../index";
import { ConnectToDb } from "../infrastructure/mongodb/connection";

jest.mock("../config/email", () => ({
  transporter: {
    sendMail: jest.fn().mockResolvedValue(true)
  }
}));

jest.mock("../infrastructure/mongodb/queries/guestPurchase", () => ({
  createPurchase: jest.fn().mockImplementation((data) => ({
    ...data,
    _id: { toString: () => "mockedid12345678" }
  }))
}));

describe("🎟️ Guest Purchase API", () => {
  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await ConnectToDb();
    }
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it("✅ should create a guest purchase and send email", async () => {
    const res = await request(app).post("/guest/purchase").send({
      guestEmail: "guest@example.com",
      billingInfo: {
        name: "Guest",
        cardNumber: "1234123412341234",
        expiry: "12/26",
        cvc: "123"
      },
      eventId: "event123",
      eventName: "Test Concert",
      eventDate: "2025-06-01",
      eventImage: "image.png",
      eventVenue: "Stadium",
      quantity: 2,
      price: 50
    });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("message", "Guest purchase successful");
    expect(res.body.purchase).toHaveProperty("totalAmount", 100);
  });

  it("❌ should return 400 if required fields are missing", async () => {
    const res = await request(app).post("/guest/purchase").send({
      guestEmail: "guest@example.com",
    });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error", "Missing required fields for guest purchase.");
  });

  it("❌ should return 500 if email fails", async () => {
    const { transporter } = require("../config/email");
    transporter.sendMail.mockRejectedValueOnce(new Error("SMTP error"));

    const res = await request(app).post("/guest/purchase").send({
      guestEmail: "guest@example.com",
      billingInfo: {
        name: "Guest",
        cardNumber: "1234123412341234",
        expiry: "12/26",
        cvc: "123"
      },
      eventId: "event123",
      eventName: "Test Concert",
      eventDate: "2025-06-01",
      eventImage: "image.png",
      eventVenue: "Stadium",
      quantity: 2,
      price: 50
    });

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty("error", "Failed to process guest purchase");
  });
});
