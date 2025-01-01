import nodemailer from "nodemailer";
import * as dotenv from "dotenv";

dotenv.config();

const emailTransporter = nodemailer.createTransport({
  service: "Gmail", // Or your email service provider
  auth: {
    user: process.env.SENDER_EMAIL,
    pass: process.env.GMAIL_PASS_KEY,
  },
});

export default emailTransporter;
