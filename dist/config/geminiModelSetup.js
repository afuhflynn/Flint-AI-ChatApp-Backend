var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "dotenv";
// Load env vars
config();
const genAI = new GoogleGenerativeAI(String(process.env.GOOGLE_GEMINI_API_KEY));
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
const genAIEndPoint = (prompt) => __awaiter(void 0, void 0, void 0, function* () {
    let result = "";
    let title = "";
    try {
        // User prompt title data set up
        const titleData = `Generate a short and consise appropriate title for this user prompt: "${prompt}.\n Let it not be more than 6 words"`;
        // User prompt response data set up
        const responseData = `Your name is Flintai Assistant bot.\nAnd then reply to this prompt: "${prompt}"`;
        // Generate a title for each chat
        // Generate content
        const aiTitle = yield model.generateContent(titleData);
        const aiResponse = yield model.generateContent(responseData);
        result = aiResponse.response.text();
        title = aiTitle.response.text();
    }
    catch (error) {
        if (error) {
            result = "An error occured. Please check your internet connection!";
        }
        // console.error(error.message);
    }
    return {
        response: result,
        title: title,
    };
});
export default genAIEndPoint;
//# sourceMappingURL=geminiModelSetup.js.map