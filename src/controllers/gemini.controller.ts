import { Request, Response } from "express";
import genAIEndPoint from "../config/geminiModelSetup.js";

export const getGemini = async (req: Request, res: Response) => {
  const { prompt } = req.body;
  try {
    if (!prompt) return res.status(400).json({ message: "Prompt is required" });
    const { response, title } = await genAIEndPoint(prompt);
    // const title: string = await genAITitleGenertorEndPoint(prompt);
    if (
      response === "An error occured. Please check your internet connection!"
    ) {
      return res.status(509).json({ message: response, title: title });
    }

    return res.status(200).json({ message: response, title: title });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
