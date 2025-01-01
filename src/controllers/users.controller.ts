import { Request, Response } from "express";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import crypto from "crypto";
import { CustomRequest } from "../middlewares/verifyTokens.js";
// Validate required fields
const validateRequiredFields = (fields: string[], body: any): string | null => {
  for (const field of fields) {
    if (!body[field]) {
      return `Field ${field} is required.`;
    }
  }
  return null;
};

// Middleware to check required fields for registration
export const validateRegisterFields = (
  req: Request,
  res: Response,
  next: Function
) => {
  const requiredFields = ["username", "password", "email"];
  const error = validateRequiredFields(requiredFields, req.body);
  if (error) {
    return res.status(400).json({ error });
  }
  next();
};

// Middleware to check required fields for login
export const validateLoginFields = (
  req: Request,
  res: Response,
  next: Function
) => {
  const requiredFields = ["username", "password"];
  const error = validateRequiredFields(requiredFields, req.body);
  if (error) {
    return res.status(400).json({ error });
  }
  next();
};

const secretKey = "your_secret_key"; // Replace with your actual secret key

// Register user
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { username, password, email } = req.body;
    const newUser = new User({ username, password: password, email });
    await newUser.save();

    const verificationCode = generateVerificationCode();
    await sendVerificationEmail(email, verificationCode);

    res.status(201).json({
      message: "User registered successfully. Verification email sent.",
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// Login a user
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password" });
    }
    const token = jwt.sign({ userId: user._id }, secretKey, {
      expiresIn: "1h",
    });
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
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
// Generate verification code
const generateVerificationCode = () => {
  return crypto.randomBytes(3).toString("hex").toUpperCase();
};

// Send verification email
const sendVerificationEmail = async (email: string, code: string) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "your_email@gmail.com",
      pass: "your_email_password",
    },
  });

  const mailOptions = {
    from: "your_email@gmail.com",
    to: email,
    subject: "Email Verification",
    text: `Your verification code is: ${code}`,
  };

  await transporter.sendMail(mailOptions);
};

// Generate access token
export const generateAccessToken = (userId: string) => {
  return jwt.sign({ userId }, secretKey, { expiresIn: "1h" });
};

// Send notification email
export const sendNotificationEmail = async (
  email: string,
  subject: string,
  message: string
) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "your_email@gmail.com",
      pass: "your_email_password",
    },
  });

  const mailOptions = {
    from: "your_email@gmail.com",
    to: email,
    subject,
    text: message,
  };

  await transporter.sendMail(mailOptions);
};
