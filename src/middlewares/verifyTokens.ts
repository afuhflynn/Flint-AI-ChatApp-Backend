import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
dotenv.config();
import User from "../models/user.model.js";
import { Response, Request, NextFunction } from "express";

export interface CustomRequest {
  id: string;
  username: string;
  email: string;
  role: string;
}

const verifyTokens = async (
  req: Request & CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const sentCookie = req.cookies?.accessToken;
  try {
    if (!sentCookie) {
      res.status(401).json({
        success: false,
        message: "Please login and verify your account. Or create one",
      });
      return;
    }

    const foundUser = await User.findOne({
      tokens: {
        $elemMatch: {
          type: "access",
          token: sentCookie,
          expiresAt: { $gt: new Date() },
        },
      },
      isActive: true,
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
            success: false,
            message: "Invalid or expired token",
          });
          return;
        }
        req.id = decoded.id;
        req.username = decoded.username;
        req.email = decoded.email;
        req.role = decoded.userRole;
        next();
      }
    );
  } catch (error) {
    const err = error as Error;
    res.status(500).json({
      success: false,
      message: err.message || "Internal server error",
    });
  }
};

export default verifyTokens;
