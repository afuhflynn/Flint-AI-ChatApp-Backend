import { Router } from "express";
import { getGemini } from "../controllers/gemini.controller.js";

const geminiRouter = Router();

geminiRouter.post("/api/ai", (req, res) => {
  getGemini(req, res);
});

export default geminiRouter;
