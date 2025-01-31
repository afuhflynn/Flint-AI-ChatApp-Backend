import { Request, Response, Router } from "express";
import {
  handleGeminiChats,
  handleUserChats,
  handleSaveGeminiChats,
} from "../controllers/gemini.controller.js";
import { RequestWithUser } from "../TYPES.js";

const geminiRouter = Router();

geminiRouter.post("/api/ai", (req, res) => {
  const handleChats = async (req: Request & RequestWithUser, res: Response) => {
    try {
      await handleUserChats(req, res);
      await handleGeminiChats(req, res, req.body.prompt);
      await handleSaveGeminiChats(req, res, req.body.chatID);
    } catch (error) {
      console.error("Error in gemini route:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };
  handleChats(req as Request & RequestWithUser, res);
});

export default geminiRouter;
