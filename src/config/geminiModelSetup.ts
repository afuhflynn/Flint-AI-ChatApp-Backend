import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "dotenv";

// Load env vars
config();

const genAI = new GoogleGenerativeAI(String(process.env.GOOGLE_GEMINI_API_KEY));
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

const genAIEndPoint = async (
  prompt: string
): Promise<{ response: string; title: string }> => {
  let result = "";
  let title = "";
  try {
    // User prompt title data set up
    const titleData = `Generate a short and consise appropriate title for this user prompt: "${prompt}.\n Let it not be more than 6 words"`;

    // User prompt response data set up
    const responseData = `Your name is Flintai Assistant bot.\nAnd then reply to this prompt: "${prompt}"`;
    // Generate a title for each chat

    // Generate content
    const aiTitle = await model.generateContent(titleData);
    const aiResponse = await model.generateContent(responseData);
    result = aiResponse.response.text();
    title = aiTitle.response.text();
  } catch (error: any | { message: string }) {
    if (error) {
      result = "An error occured. Please check your internet connection!";
    }
    // console.error(error.message);
  }
  return {
    response: result,
    title: title,
  };
};

export default genAIEndPoint;
