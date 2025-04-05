import dotenv from "dotenv-safe";
import nodemailer from "nodemailer";
dotenv.config({ allowEmptyValues: true, path: `.env.local` });

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});