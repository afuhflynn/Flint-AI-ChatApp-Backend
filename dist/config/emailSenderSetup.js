var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import emailTransporter from "./emailTransporter.js";
import { config } from "dotenv";
import logger from "../utils/loger.js";
// Load env vars
config();
const from = `Afuh Flyine from Flintai ${process.env.SENDER_EMAIL}`;
export const sendEmail = (to, subject, htmlContent, headers, attachments) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield emailTransporter.sendMail({
            from: from,
            to,
            subject,
            html: htmlContent,
            attachments: attachments,
            headers: headers,
        });
        console.log("Email sent successfully!");
        logger.error(`Email sent successfully! to ${to}`);
    }
    catch (error) {
        logger.error(`Error sending email: ${error.message} - to ${to}`);
        console.error("Error sending email:", error);
    }
});
//# sourceMappingURL=emailSenderSetup.js.map