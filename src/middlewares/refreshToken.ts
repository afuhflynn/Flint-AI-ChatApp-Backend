import { Request, Response, NextFunction } from "express";
import logger from "../utils/loger.js";
import { RequestWithUser } from "../TYPES.js";
import { refreshHandler } from "../controllers/users.controller.js";

export const refreshTokens = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const refresh = async (
    req: Request & RequestWithUser,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      refreshHandler(req as Request & RequestWithUser, res, next);
    } catch (error: any | { message: string }) {
      logger.error(`Error in refresh token route: ${error.message}`);
      res.status(500).json({ error: "Internal server error" });
    }
  };
  refresh(req as Request & RequestWithUser, res, next);
};
