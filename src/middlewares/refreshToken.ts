import { Request, Response } from "express";
import logger from "../utils/loger.js";
import { refreshHandler } from "../controllers/users.controller.js";

export const refreshTokens = (req: Request, res: Response) => {
  try {
    refreshHandler(req as Request, res);
  } catch (error: any | { message: string }) {
    logger.error(`Error in refresh token route: ${error.message}`);
    res.status(500).json({ error: "Internal server error" });
  }
};
