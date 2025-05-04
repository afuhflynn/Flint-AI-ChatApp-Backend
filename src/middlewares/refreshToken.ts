import { Request, Response } from "express";
import logger from "../utils/loger.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
config();

export const refreshTokens = (req: Request, res: Response) => {
  const handler = async (req: Request, res: Response) => {
    try {
      const sentAccessToken = req.cookies?.token;
      if (!sentAccessToken) {
        return res.status(401).json({ message: "Login required to continue" });
      }

      // Find the user by refresh token
      const foundUser = await User.findOne({
        accessToken: sentAccessToken,
        refreshTokenExpires: { $gt: Date.now() },
      });
      console.log(foundUser, sentAccessToken);
      if (!foundUser) {
        return res.status(403).json({ message: "Invalid refresh token" });
      }

      if (foundUser) {
        // Verify the refresh token
        jwt.verify(
          foundUser.refreshToken as string,
          process.env.REFRESH_TOKEN_SECRET as string,
          { algorithms: ["HS256"] },
          async (error: any, _: any) => {
            if (error) {
              return res
                .status(403)
                .json({ message: "Invalid or expired refresh token" });
            }

            // Generate a new access token
            const newAccessToken = jwt.sign(
              {
                id: foundUser._id,
                username: foundUser.username,
                email: foundUser.email,
                role: foundUser.role,
              },
              process.env.ACCESS_TOKEN_SECRET as string,
              { algorithm: "HS256", expiresIn: "1h" }
            );

            // Update the user’s access token and expiration in the database
            foundUser.accessToken = newAccessToken;
            foundUser.accessTokenExpires = new Date(
              Date.now() + 60 * 60 * 1000
            ); // 1 hour
            await foundUser.save();

            // Set the new access token in the cookie
            res.cookie("token", newAccessToken, {
              httpOnly: true,
              sameSite: "strict",
              secure: process.env.APP_STATUS === "development" ? false : true,
              maxAge: Date.now() + 60 * 60 * 1000, // 1 hour
            });

            return res.status(202); // Accepted
          }
        );
      }
    } catch (error: any | { message: string }) {
      logger.error(`Error refreshing cookies (tokens): ${error.message}`);
      return res
        .status(500)
        .json({ message: "Internal server error. Please try again later" });
    }
  };
  handler(req, res);
};
