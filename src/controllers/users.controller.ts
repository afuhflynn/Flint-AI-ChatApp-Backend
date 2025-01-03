import { Request, Response } from "express";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import { CustomRequest } from "../middlewares/verifyTokens.js";
import {
  sendVerificationEmail,
  sendWelcomeEmail,
} from "../utils/Emails/send.emails.js";
import generateVerificationCode from "../utils/generateVerificationCode.js";
import { UserSchemaTypes } from "../TYPES.js";

declare module "express-session" {
  interface SessionData {
    visited?: boolean;
    userId: "";
    user: UserSchemaTypes | null;
  }
}

// Register user
export const registerUser = async (req: Request, res: Response) => {
  const { username, password, email } = req.body;
  // Check if all required fields are provided
  if (!username || !password || !email)
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  try {
    // Check if user already exists
    const user = await User.findOne({ username, email });
    if (user)
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationCode: string = generateVerificationCode();
    // Verification expires at date
    const verificationCodeExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const newUser = new User({
      username,
      password: hashedPassword,
      email,
      verificationCode,
      verificationCodeExpires,
    });
    await newUser.save();

    await sendVerificationEmail(verificationCode, email, username, {
      "X-Category": "Verification Email",
    });

    return res.status(201).json({
      message: "User registered successfully. Verification email sent.",
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Login a user
export const loginUser = async (
  req: Request & CustomRequest,
  res: Response
) => {
  try {
    // Send welcome email since there is passport authentication
    if (req.session.user?.email && req.session.user?.username)
      await sendWelcomeEmail(
        req.session.user.email,
        req.session.user.username,
        {
          "X-Category": "Welcome Email",
        }
      );
    return res.status(200).json({ message: "Logged in successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Get user profile
export const getUserProfile = async (
  req: Request & CustomRequest,
  res: Response
) => {
  try {
    const userId = req.id; // Assuming userId is set in the request by an auth middleware
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update user profile
export const updateUserProfile = async (
  req: Request & CustomRequest,
  res: Response
) => {
  try {
    const userId = req.id; // Assuming userId is set in the request by an auth middleware
    const { username, password } = req.body;
    const updatedData: any = { username };
    if (password) {
      updatedData.password = await bcrypt.hash(password, 10);
    }
    const updatedUser = await User.findByIdAndUpdate(userId, updatedData, {
      new: true,
    });
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete user account
export const deleteUserAccount = async (
  req: Request & CustomRequest,
  res: Response
) => {
  try {
    const userId = req.id; // Assuming userId is set in the request by an auth middleware
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ message: "User account deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
