import emailTransporter from "./emailTransporter.js";
import { config } from "dotenv";
import { Attachment } from "nodemailer/lib/mailer/index.js";
import logger from "../utils/loger.js";

// Load env vars
config();

const from = `Afuh Flyine from Flintai ${process.env.SENDER_EMAIL}`;

export const sendEmail = async (
  to: string,
  subject: string,
  htmlContent: string,
  headers: {
    "X-Category": string;
  },
  attachments?: Attachment[]
): Promise<void> => {
  try {
    await emailTransporter.sendMail({
      from: from,
      to,
      subject,
      html: htmlContent,
      attachments: attachments,
      headers: headers,
    });
    console.log("Email sent successfully!");
    logger.error(`Email sent successfully! to ${to}`);
  } catch (error: any | { message: string }) {
    logger.error(`Error sending email: ${error.message} - to ${to}`);
    console.error("Error sending email:", error);
  }
};
