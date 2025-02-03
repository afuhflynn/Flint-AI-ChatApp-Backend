import { Request, Response, Router } from "express";
import {
  handleGeminiChats,
  handleUserChats,
  handleSaveGeminiChats,
  handleGeminiResponse,
} from "../controllers/gemini.controller.js";
import { RequestWithUser } from "../TYPES.js";
import logger from "../utils/loger.js";

const geminiRouter = Router();

geminiRouter.post("/api/v1/ai", (req, res) => {
  // Protected route
  const handleChats = async (req: Request & RequestWithUser, res: Response) => {
    try {
      await handleUserChats(req, res);
      await handleGeminiChats(req, res, req.body.prompt);
      await handleSaveGeminiChats(req, res, req.body.chatID);
    } catch (error: any | { message: string }) {
      logger.error(`Error in gemini route: ${error.message}`);
      res.status(500).json({ error: "Internal server error" });
    }
  };
  handleChats(req as Request & RequestWithUser, res);
});

geminiRouter.post("/api/ai", async (req, res) => {
  // Unprotected route
  try {
    await handleGeminiResponse(req, res);
  } catch (error: any | { message: string }) {
    logger.error(`Error in gemini route: ${error.message}`);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default geminiRouter;
