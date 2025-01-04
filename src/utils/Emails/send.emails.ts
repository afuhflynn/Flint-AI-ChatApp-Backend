import {
  accountLogoutEmailTemplate,
  accountNotificationTemplate,
  passwordResetEmailTemplate,
  verificationEmailTemplate,
  welcomeEmailTemplate,
  accountDeleteEmailTemplate,
} from "../../emailsTemplateSetup/emailTemplates.js";
import crypto from "crypto";
import { sendEmail } from "../../config/emailSenderSetup.js";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const attachments = [
  {
    filename: "flintai logo", // Inline file
    path: path.join(
      __dirname,
      "..",
      "..",
      "assets",
      "logo",
      "flintai-logo.png"
    ), // Path to inline image
    cid: "unique_inline_logo_cid", // Content-ID for inline image (must be unique)
  },
];
const sendVerificationEmail = async (
  code: string,
  email: string,
  username: string,
  headers: {
    "X-Category": string;
  }
) => {
  try {
    const token = await crypto.randomBytes(20).toString("hex");
    const newEmail: string = verificationEmailTemplate
      .replace("[user_name]", username)
      .replace("[verification_code]", code)
      .replace(
        "href=[verification_link]",
        `href=${process.env.CLIENT_URL}/confirm-email/${token}`
      );
    await sendEmail(
      email,
      "Verification Email",
      newEmail,
      headers,
      attachments
    );
  } catch (error: any | { message: string }) {
    console.error(error.message);
  }
};

const sendNotificationEmail = async (
  activity: string,
  email: string,
  username: string,
  time: string,
  author: string,
  headers: {
    "X-Category": string;
  }
) => {
  try {
    const newEmail: string = accountNotificationTemplate
      .replace("[user_name]", username)
      .replace("[activity_description]", activity)
      .replace("[activity_time]", time)
      .replace("[activity_author]", author)
      .replace(
        "href=[account_security_link]",
        `href=${process.env.CLIENT_URL}`
      );
    await sendEmail(
      email,
      "Notification Email",
      newEmail,
      headers,
      attachments
    );
  } catch (error: any | { message: string }) {
    console.error(error.message);
  }
};
const sendWelcomeEmail = async (
  email: string,
  username: string,
  headers: {
    "X-Category": string;
  }
) => {
  try {
    const newEmail: string = welcomeEmailTemplate
      .replace("[user_name]", username)
      .replace("href=[homepage_link]", `href=${process.env.CLIENT_URL}`);
    //Send email content
    await sendEmail(email, "Welcome Email", newEmail, headers, attachments);
  } catch (error: any | { message: string }) {
    console.error(error.message);
  }
};
const sendLogoutEmail = async (
  email: string,
  username: string,
  headers: {
    "X-Category": string;
  }
) => {
  try {
    const newEmail: string = accountLogoutEmailTemplate
      .replace("[user_name]", username)
      .replace(
        "href=[account_security_link]",
        `href=${process.env.CLIENT_URL}`
      );
    //Send email content
    await sendEmail(email, "Logout Email", newEmail, headers, attachments);
  } catch (error: any | { message: string }) {
    console.error(error.message);
  }
};
const sendPasswordResetEmail = async (
  email: string,
  username: string,
  resetUrl: string,
  headers: {
    "X-Category": string;
  }
) => {
  try {
    const newEmail: string = passwordResetEmailTemplate
      .replace("[user_name]", username)
      .replace("[reset_link]", resetUrl)
      .replace("href=[reset_link]", `href=${resetUrl}`);
    //Send email content
    await sendEmail(
      email,
      "Password Reset Email",
      newEmail,
      headers,
      attachments
    );
  } catch (error: any | { message: string }) {
    console.error(error.message);
  }
};
const sendAccountDeleteEmail = async (
  email: string,
  username: string,
  deleteUrl: string,
  headers: {
    "X-Category": string;
  }
) => {
  try {
    const newEmail: string = accountDeleteEmailTemplate
      .replace("[user_name]", username)
      .replace("href=[cancel_deletion_link]", `href=${process.env.CLIENT_URL}`)
      .replace("href=[account_deletion_link]", `href=${deleteUrl}`)
      .replace("[account_deletion_link]", deleteUrl)
      .replace("[cancel_deletion_link]", process.env.CLIENT_URL!);
    //Send email content
    await sendEmail(
      email,
      "Account Delete Email",
      newEmail,
      headers,
      attachments
    );
  } catch (error: any | { message: string }) {
    console.error(error.message);
  }
};

export {
  sendVerificationEmail,
  sendNotificationEmail,
  sendWelcomeEmail,
  sendLogoutEmail,
  sendPasswordResetEmail,
  sendAccountDeleteEmail,
};
