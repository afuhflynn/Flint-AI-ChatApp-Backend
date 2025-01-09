import { Router } from "express";
import { getGeminiResponse } from "../controllers/gemini.controller.js";

const geminiRouter = Router();

geminiRouter.post("/api/ai", async (req, res) => {
  try {
    await getGeminiResponse(req, res);
  } catch (error) {
    console.error("Error in gemini route:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default geminiRouter;
