import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
dotenv.config();
import User from "../models/user.model.js";
import { Response, Request, NextFunction } from "express";
import { RequestWithUser } from "../TYPES.js";

const verifyTokens = async (
  req: Request & RequestWithUser,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const sentCookie = req.cookies?.token;
  try {
    if (!sentCookie) {
      res.status(401).json({
        success: false,
        message: "Please login and verify your account. Or create one",
      });
      return;
    }

    const foundUser = await User.findOne({
      accessToken: sentCookie,
      accessTokenExpires: { $gt: Date.now() },
    });

    if (!foundUser) {
      res.status(403).json({
        success: false,
        message: "Invalid or expired token",
      });
      return;
    }

    jwt.verify(
      sentCookie,
      process.env.ACCESS_TOKEN_SECRET as string,
      { algorithms: ["HS256"] },
      (error, decoded: any) => {
        if (error) {
          res.status(403).json({
            message: "Invalid or expired token",
          });
          return;
        }
        req.user.id = decoded.id;
        req.user.username = decoded.username;
        req.user.email = decoded.email;
        req.user.role = decoded.role;
        next();
      }
    );
  } catch (error) {
    const err = error as Error;
    res.status(500).json({
      message: err.message || "Internal server error",
    });
  }
};

export default verifyTokens;
