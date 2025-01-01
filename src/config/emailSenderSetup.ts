import emailTransporter from "./emailTransporter.js";
import { config } from "dotenv";
import { Attachment } from "nodemailer/lib/mailer/index.js";

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
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
