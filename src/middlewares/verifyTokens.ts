import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
dotenv.config();
import User from "../models/user.model.js";
import { Response, Request, NextFunction } from "express";
import { RequestWithUser, UserSchemaTypes } from "../TYPES.js";
import logger from "../utils/loger.js";

const verifyTokens = (req: Request, res: Response, next: NextFunction) => {
  const verify = async (
    req: Request & RequestWithUser,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const sentCookie = req.cookies?.token;
    try {
      if (!sentCookie) {
        res.status(401).json({
          message: "Please login and verify your account. Or create one",
        });
        return; // Exit the function without doing anything
      }

      const foundUser = await User.findOne({
        accessToken: sentCookie,
        accessTokenExpires: { $gt: Date.now() },
      });

      if (!foundUser) {
        res.status(403).json({
          message: "Invalid or expired token",
        });
        return;
      }

      jwt.verify(
        sentCookie,
        process.env.ACCESS_TOKEN_SECRET as string,
        { algorithms: ["HS256"] },
        (error, _: any) => {
          if (error) {
            res.status(403).json({
              message: "Invalid or expired session",
            });
            return;
          }
          // First empty the req user object
          req.user = {} as UserSchemaTypes;

          req.user.id = foundUser._id;
          req.user.username = foundUser.username;
          req.user.email = foundUser.email;
          req.user.role = foundUser.role;
          next();
        }
      );
    } catch (error: any) {
      logger.error(`Error verifying user token: ${error.message}`);
      res
        .status(500)
        .json({ message: "Internal server error. Please try again later" });
      return; // Just exit without doing anything
    }
  };
  verify(req as Request & RequestWithUser, res, next);
};

export default verifyTokens;
