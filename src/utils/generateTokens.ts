import jwt from "jsonwebtoken";
import { Response } from "express";
import { config } from "dotenv";

// Load env vars
config();

const generateTokens = async (
  res: Response,
  email: string,
  username: string,
  id: string,
  userRole: string
): Promise<{ accessToken: string; expiresAt: Date }> => {
  const privateAccessKey: string | undefined = process.env.ACCESS_TOKEN_SECRET;

  if (!privateAccessKey) {
    throw new Error(
      "ACCESS_TOKEN_SECRET is not defined in the environment variables."
    );
  }

  const accessToken = jwt.sign(
    { email: email, username: username, id: id, userRole: userRole },
    privateAccessKey,
    { algorithm: "HS256", expiresIn: "30d" }
  );

  const dateNow = Date.now() + 720 * 60 * 60 * 1000;
  const expiresAt = new Date(dateNow);

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.APP_STATUS === "production" && true,
    sameSite: "strict",
    maxAge: dateNow,
  });

  return { accessToken, expiresAt };
};

export default generateTokens;
