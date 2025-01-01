var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { accountLogoutEmailTemplate, accountNotificationTemplate, passwordResetEmailTemplate, verificationEmailTemplate, welcomeEmailTemplate, accountDeleteEmailTemplate, } from "../../emailsTemplateSetup/emailTemplates.js";
import { sendEmail } from "../../config/emailSenderSetup.js";
import path from "node:path";
import { fileURLToPath } from "node:url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const attachments = [
    {
        filename: "syntaxspring_logo", // Inline file
        path: path.join(__dirname, "..", "..", "assets", "logo", "logo.png"), // Path to inline image
        cid: "unique_inline_logo_cid", // Content-ID for inline image (must be unique)
    },
];
const sendVerificationEmail = (code, email, username, headers) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newEmail = verificationEmailTemplate
            .replace("[user_name]", username)
            .replace("[verification_code]", code);
        yield sendEmail(email, "Verification Email", newEmail, headers, attachments);
    }
    catch (error) {
        console.error(error.message);
    }
});
const sendNotificationEmail = (activity, email, username, time, author, headers) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newEmail = accountNotificationTemplate
            .replace("[user_name]", username)
            .replace("[activity_description]", activity)
            .replace("[activity_time]", time)
            .replace("[activity_author]", author);
        yield sendEmail(email, "Notification Email", newEmail, headers, attachments);
    }
    catch (error) {
        console.error(error.message);
    }
});
const sendWelcomeEmail = (email, username, headers) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newEmail = welcomeEmailTemplate.replace("[user_name]", username);
        //Send email content
        yield sendEmail(email, "Welcome Email", newEmail, headers, attachments);
    }
    catch (error) {
        console.error(error.message);
    }
});
const sendLogoutEmail = (email, username, headers) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newEmail = accountLogoutEmailTemplate.replace("[user_name]", username);
        //Send email content
        yield sendEmail(email, "Logout Email", newEmail, headers, attachments);
    }
    catch (error) {
        console.error(error.message);
    }
});
const sendPasswordResetEmail = (email, username, resetUrl, headers) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newEmail = passwordResetEmailTemplate
            .replace("[user_name]", username)
            .replace("[reset_link]", resetUrl);
        //Send email content
        yield sendEmail(email, "Password Reset Email", newEmail, headers, attachments);
    }
    catch (error) {
        console.error(error.message);
    }
});
const sendAccountDeleteEmail = (email, username, headers) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newEmail = accountDeleteEmailTemplate.replace("[user_name]", username);
        //Send email content
        yield sendEmail(email, "Account Delete Email", newEmail, headers, attachments);
    }
    catch (error) {
        console.error(error.message);
    }
});
export { sendVerificationEmail, sendNotificationEmail, sendWelcomeEmail, sendLogoutEmail, sendPasswordResetEmail, sendAccountDeleteEmail, };
//# sourceMappingURL=send.emails.js.map