import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "dotenv";
import logger from "../utils/loger.js";

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
    logger.error(`Error generating ai response: ${error.message}`);
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
    logger.error(`Error generating ai response: ${error.message}`);
    if (error) {
      title = "An error occured. Please check your internet connection!";
    }
    // console.error(error.message);
  }
  return title;
};

export { genAIEndPoint, genAITitleEndPoint };

// const {
//   GoogleGenerativeAI,
//   HarmCategory,
//   HarmBlockThreshold,
// } = require("@google/generative-ai");

// const apiKey = process.env.GEMINI_API_KEY;
// const genAI = new GoogleGenerativeAI(apiKey);

// const model = genAI.getGenerativeModel({
//   model: "tunedModels/criticalthinkingaitraining-6lyg4w9h30z7",
// });

// const generationConfig = {
//   temperature: 1,
//   topP: 0.95,
//   topK: 64,
//   maxOutputTokens: 8192,
//   responseMimeType: "text/plain",
// };

// async function run() {
//   const chatSession = model.startChat({
//     generationConfig,
//     history: [
//       {
//         role: "user",
//         parts: [{ text: "Hello ai how can I create a startup in Cameroon" }],
//       },
//       {
//         role: "model",
//         parts: [
//           {
//             text: "Hello!  I'm Flintai, your Startup Idea Generator and Advisor. Cameroon offers exciting opportunities for startups! To give you the best advice, I need a little more information.  Tell me about your interests, skills, and what kind of impact you want to make.  For example:\n\n* **What industries are you passionate about?** (e.g., technology, agriculture, education, healthcare, tourism)\n* **What problems have you observed in your community that you'd like to solve?**\n* **Do you have any specific skills or expertise you want to leverage?** (e.g., coding, marketing, design, farming)\n* **What are your resources like?** (e.g., access to funding, networks, technology)\n\nOnce I have a better understanding of your background and goals, I can generate some tailored startup ideas for you.  Let's brainstorm together!\n",
//           },
//         ],
//       },
//       {
//         role: "user",
//         parts: [
//           {
//             text: "I am interested in technology and education\nI want to solve the problem of lack of confidence in student who study computer engineering, lack of motivation to study, lack of hope of for the future. Make them take challenges to study, interact with each other and learn without pressure.\nI am a full stack nextjs and mern stack programmer learning ml and other necessary fields.\n",
//           },
//         ],
//       },
//       {
//         role: "model",
//         parts: [
//           {
//             text: "That's fantastic! You've identified a real challenge and have the technical skills to potentially address it.  Lack of confidence, motivation, and hope can be significant hurdles for students, especially in a demanding field like computer engineering.  Here are some startup ideas combining technology and education to address these issues in Cameroon:\n\n**1. Gamified Learning Platform with a Focus on Collaboration and Mentorship:**\n\n* **Concept:** Develop a platform that uses game mechanics like points, badges, and leaderboards to make learning computer engineering concepts more engaging.  Incorporate team-based challenges and projects to foster collaboration and peer learning.  Integrate a mentorship component connecting students with experienced professionals in the field for guidance and inspiration.\n* **Technology:** Your Next.js/MERN stack expertise is perfect for building this. Consider incorporating AI elements for personalized learning paths and feedback.\n* **Monetization:**  Freemium model (basic access is free, premium features require a subscription), sponsorships from tech companies, or partnerships with universities.\n\n**2. Virtual Reality (VR) Bootcamps for Practical Experience:**\n\n* **Concept:** Offer immersive VR experiences that simulate real-world engineering scenarios. Students can practice coding, troubleshooting, and problem-solving in a safe and engaging environment. This hands-on approach can boost confidence and provide practical skills.\n* **Technology:**  VR development requires specialized skills, but you can partner with VR developers or explore readily available VR development tools.  Tie this back to your platform in idea #1 for assessments and progress tracking.\n* **Monetization:**  Fee-based bootcamps, corporate training partnerships, or licensing the VR modules to educational institutions.\n\n**3. Online Portfolio Builder and Career Networking Platform:**\n\n* **Concept:** Create a platform that helps students build professional portfolios showcasing their projects and skills.  Integrate a networking component that connects students with potential employers and internship opportunities. This can address the lack of hope for the future by directly linking education to career prospects.\n* **Technology:** Your existing web development skills are well-suited for this. Consider incorporating AI-powered resume optimization and job matching features.\n* **Monetization:** Freemium model, recruitment fees from companies, or premium features for portfolio enhancement.\n\n**4.  Coding Challenge and Hackathon Platform:**\n\n* **Concept:** Organize regular online coding challenges and hackathons focused on solving real-world problems relevant to Cameroon. This provides a platform for students to demonstrate their skills, gain recognition, and build confidence.\n* **Technology:** Your full-stack skills are ideal. Consider integrating judging and feedback mechanisms.\n* **Monetization:** Sponsorships from companies, prizes for winners, or premium features for participants.\n\n\n**Next Steps:**\n\n1. **Market Research:** Validate these ideas by talking to computer engineering students in Cameroon. Understand their specific needs and challenges.\n2. **MVP Development:**  Start with a Minimum Viable Product (MVP) for the idea that resonates most with your target audience.\n3. **Community Building:** Engage with the student community through social media and online forums to build interest and gather feedback.\n\nI'm here to help you refine these ideas further. Which one excites you the most? What are your initial thoughts? Let's discuss!\n",
//           },
//         ],
//       },
//       {
//         role: "user",
//         parts: [
//           {
//             text: "I am interested in technology and education\nI want to solve the problem of lack of confidence in student who study computer engineering, lack of motivation to study, lack of hope of for the future. Make them take challenges to study, interact with each other and learn without pressure.\nI am a full stack nextjs and mern stack programmer learning ml I am interested in technology and education\nI want to solve the problem of lack of confidence in student who study computer engineering, lack of motivation to study, lack of hope of for the future. Make them take challenges to study, interact with each other and learn without pressure.\nI am a full stack nextjs and mern stack programmer learning ml and other necessary fields.\nand other necessary fields.\n",
//           },
//         ],
//       },
//       {
//         role: "model",
//         parts: [
//           {
//             text: "That's a great initiative!Build a personalized gamified platform for learning computer engineering concepts.Focus on gamification, collaboration, and practical projects to boost motivation and confidence.Partner with schools or institutions for a pilot program.Innovate with gamified assessment tools to promote active participation.Add a mentorship program to boost confidence and motivation.Host workshops to teach coding and gamification techniques.Use AI for personalized recommendations and skill assessments.Host competitions for students to showcase their skills.Develop a community forum for discussion and peer support.Focus on gamification, collaboration, and practical projects.Develop a robust and user-friendly platform.Partner with educational institutions.Host workshops to teach coding and gamification techniques.Integrate AI for personalized learning.Host competitions for students.",
//           },
//         ],
//       },
//     ],
//   });

//   const result = await chatSession.sendMessage("INSERT_INPUT_HERE");
//   console.log(result.response.text());
// }

// run();
