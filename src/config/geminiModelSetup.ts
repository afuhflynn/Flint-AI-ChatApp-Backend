import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "dotenv";

// Load env vars
config();

const genAI = new GoogleGenerativeAI(String(process.env.GOOGLE_GEMINI_API_KEY));
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
// model.generateContentStream
// model.generationConfig
// model.toolConfig
// model.startChat

// TODO: In the future models will perform conversations based on history

const genAIEndPoint = async (
  prompt: string,
  chatHistory?: {
    id: string;
    title: string | any;
    createdAt: Date;
    updatedAt?: Date;
    chat: {
      id: string;
      user: string;
      bot: string | any;
    }[];
  }
): Promise<string> => {
  console.log(chatHistory);
  let result = "";
  try {
    // User prompt response data set up
    const responseData = `Your name is Flintai Assistant bot.\nAnd then reply to this prompt: "${prompt}"`;

    // Generate content
    const aiResponse = await model.generateContent(responseData);
    result = aiResponse.response.text();
  } catch (error: any | { message: string }) {
    if (error) {
      result = "An error occured. Please check your internet connection!";
    }
    // console.error(error.message);
  }
  return result;
};
const genAITitleEndPoint = async (prompt: string): Promise<string> => {
  let title = "";
  try {
    // User prompt title data set up
    const titleData = `Generate a short and consise appropriate title for this user prompt: "${prompt}.\n Let it not be more than 6 words"`;
    // Generate a user prompt title
    const aiTitle = await model.generateContent(titleData);
    title = aiTitle.response.text();
  } catch (error: any | { message: string }) {
    if (error) {
      title = "An error occured. Please check your internet connection!";
    }
    // console.error(error.message);
  }
  return title;
};

export { genAIEndPoint, genAITitleEndPoint };
