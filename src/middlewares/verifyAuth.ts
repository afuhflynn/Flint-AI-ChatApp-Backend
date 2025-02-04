import { Request, Response, NextFunction } from "express";
import User from "../models/user.model.js";
import { RequestWithUser, UserSchemaTypes } from "../TYPES.js";
import logger from "../utils/loger.js";

// Check auth state
export const checkAuthState = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const checkAuth = async (
    req: Request & RequestWithUser,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const user = await User.findOne({
        _id: req.user.id,
        username: req.user.username,
        email: req.user.email,
        role: req.user.role,
        isVerified: true,
      });
      if (!user)
        return res.status(401).json({
          success: false,
          message: "Please confirm your email and login to your account",
        });

      // First empty the req user object
      req.user = {} as UserSchemaTypes;

      req.user.id = user._id;
      req.user.username = user.username;
      req.user.email = user.email;
      req.user.role = user.role;
      next();
    } catch (error: any | { message: string }) {
      logger.error(`Error Checking user auth state: ${error.message}`);
      return res
        .status(500)
        .json({ message: "Internal server error. Please try again later" });
    }
  };
  checkAuth(req as Request & RequestWithUser, res, next);
};
