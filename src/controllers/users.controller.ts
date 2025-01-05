import { Request, Response } from "express";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import crypto from "node:crypto";
import { CustomRequest } from "../middlewares/verifyTokens.js";
import { v2 as cloudinary } from "cloudinary";
import {
  sendAccountDeleteEmail,
  sendNotificationEmail,
  sendPasswordResetEmail,
  sendVerificationEmail,
  sendWelcomeEmail,
} from "../utils/Emails/send.emails.js";
import generateVerificationCode from "../utils/generateVerificationCode.js";
import { UserSchemaTypes } from "../TYPES.js";
import generateResetToken from "../utils/generateResetToken.js";

declare module "express-session" {
  interface SessionData {
    visited?: boolean;
    userId: "";
    user: UserSchemaTypes | null;
  }

  interface SessionStore {
    // session store interface
    get: (
      sid: string,
      callback: (err: any, session: Session | null) => void
    ) => void;
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
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Login a user
export const loginUser = async (req: Request, res: Response) => {
  try {
    // Send welcome email since there is passport authentication
    if (req.session.user?.email && req.session.user?.username)
      //send notification email
      await sendNotificationEmail(
        "Account Login",
        req.session.user.email,
        req.session.user.username,
        new Date().toLocaleDateString(),
        `${(req.session.user.username, req.session.user.email)}`,
        { "X-Category": "Login Notification" }
      );
      req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days
    return res.status(200).json({ message: "Logged in successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Logout user
export const logoutUser = async (req: Request, res: Response) => {
  try {
    req.session.destroy(async (error) => {
      if (error) {
        return res.status(500).json({ message: "Internal server error" });
      }
      // send account notificaiton email
      if (req.session.user?.email && req.session.user?.username) {
        console.log(req.session.user);
        await sendNotificationEmail(
          "Account Logout",
          req.session.user.email,
          req.session.user.username,
          new Date().toLocaleDateString(),
          `${(req.session.user.username, req.session.user.email)}`,
          { "X-Category": "Logout Notification" }
        );
      }
      // Clear cookies
      res.clearCookie("connect.sid");
      return res.status(200).json({ message: "Logged out successfully" });
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Send user account delete request for warning
export const sendDeleteAccountRequest = async (
  req: Request & CustomRequest,
  res: Response
) => {
  try {
    let userId: string = "";
    if (req.session.user?.id) userId = req.session.user.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const token = await crypto.randomBytes(60).toString("hex");
    user.accountDeleteToken = token;
    await user.save();
    await sendAccountDeleteEmail(
      user.email,
      user.username,
      `${process.env.CLIENT_URL}/delete-account/${user._id}/${token}`,
      { "X-Category": "Account Delete Email" }
    );
    return res.status(200).json({ message: "Account deletion request sent" });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Delete user account
export const deleteUserAccount = async (
  req: Request & CustomRequest,
  res: Response
) => {
  const { userId, token } = req.params;
  try {
    const deletedUser = await User.deleteOne({
      _id: userId,
      accountDeleteToken: token,
    });
    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    // Send account delete notification email
    if (req.session.user)
      await sendNotificationEmail(
        "Account Deletion",
        req.session.user.email,
        req.session.user.username,
        new Date().toLocaleDateString(),
        `${(req.session.user.username, req.session.user.email)}`,
        { "X-Category": "Account Deletion Notification" }
      );

    //Delete the user session from the express-session object
    req.session.destroy((error) => {
      if (error) {
        return res.status(500).json({ message: "Internal server error" });
      }
    });
    return res
      .status(200)
      .json({ message: "User account deleted successfully" });
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
    let userId: string = "";
    if (req.session.user?.id) userId = req.session.user.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(403).json({ error: "User not found" });
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
    let userId: string = "";
    if (req.session.user?.id) userId = req.session.user.id;
    const { username, password, avatarUrl } = req.body;
    // Post avatarUrl to cloudinary before storing in db
    let newAvatarUrl: string = "";
    (async function () {
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
        api_key: process.env.CLOUDINARY_API_KEY!,
        api_secret: process.env.CLOUDINARY_API_SECRET!,
      });

      // Upload user avatar image
      const uploadResult = await cloudinary.uploader.upload(avatarUrl, {
        public_id: "Flint ai user avatar",
      });

      newAvatarUrl = uploadResult.url;
    });
    const updatedData: any = { username };
    if (password) updatedData.password = await bcrypt.hash(password, 10);
    if (avatarUrl) updatedData.avatarUrl = newAvatarUrl;
    const updatedUser = await User.findByIdAndUpdate(userId, updatedData, {
      new: true,
    });
    if (!updatedUser) {
      return res.status(403).json({ error: "User not found" });
    }
    await sendNotificationEmail(
      "Profile Update",
      updatedUser.email,
      updatedUser.username,
      new Date().toLocaleDateString(),
      `${(updatedUser.username, updatedUser.email)}`,
      { "X-Category": "Profile Update Notification" }
    );
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// Verify user account
export const verifyUserAccount = async (req: Request, res: Response) => {
  const { code } = req.body;
  if (!code)
    return res
      .status(400)
      .json({ success: false, message: "Verification code is required" });
  try {
    // Find for a user with verification code that has not expired
    const user = await User.findOne({
      verificationCode: code,
      isVerified: false,
      verificationCodeExpires: { $gt: new Date(Date.now()) },
    });
    if (!user)
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification code",
      });
    user.isVerified = true;
    await user.save();
    await sendWelcomeEmail(user.email, user.username, {
      "X-Category": "Welcome Email",
    });
    return res.status(200).json({ message: "User account verified" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Resend verification code
export const resendVerificationCode = async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email)
    return res
      .status(400)
      .json({ success: false, message: "Email is required" });
  try {
    const user = await User.findOne({
      email,
      verificationCodeExpires: { $gt: new Date(Date.now()) },
    });
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    if (user.isVerified)
      return res.status(400).json({ success: false, message: "User verified" });
    // Generate new verification code
    const verificationCode: string = generateVerificationCode();
    user.verificationCode = verificationCode;
    user.verificationCodeExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await user.save();
    await sendVerificationEmail(verificationCode, email, user.username, {
      "X-Category": "Verification Email",
    });
    return res.status(200).json({ message: "Verification email sent" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Request to reset password
export const requestPasswordReset = async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email)
    return res
      .status(400)
      .json({ success: false, message: "Email is required" });
  try {
    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(403)
        .json({ success: false, message: "User not found" });
    const { resetToken, expiresAt } = await generateResetToken();
    user.resetPasswordToken = resetToken;
    user.resetPasswordTokenExpires = expiresAt;
    await user.save();
    await sendPasswordResetEmail(
      email,
      user.username,
      `${process.env.CLIENT_URL}/reset-password/${resetToken}`,
      {
        "X-Category": "Password Reset Email",
      }
    );
    return res.status(200).json({ message: "Password reset email sent" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Reset password
export const resetPassword = async (req: Request, res: Response) => {
  const { token } = req.params;
  const { password } = req.body;
  if (!password)
    return res
      .status(400)
      .json({ success: false, message: "A valid password is required" });
  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordTokenExpires: { $gt: new Date(Date.now()) },
    });
    if (!user)
      return res.status(403).json({
        success: false,
        message: "Invalid or expired reset link. Try again later",
      });
    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = "";
    user.resetPasswordTokenExpires = undefined;
    await user.save();
    sendNotificationEmail(
      "Password Reset",
      user.email,
      user.username,
      new Date().toLocaleDateString(),
      `${(user.username, user.email)}`,
      { "X-Category": "Password Reset Notification" }
    );
    return res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Check auth state
export const checkAuthState = async (req: Request, res: Response) => {
  try {
    let userId: string = "";
    if (req.session.user?.id) userId = req.session.user.id;
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "User not found" });
    }
    req.user = req.session.user as UserSchemaTypes;
    return res.status(200).json({ success: true, user });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Handle github login
export const githubLogin = async (req: Request, res: Response) => {
  try {
    if (req.session.user?.email && req.session.user?.username) {
      //send notification email
      await sendNotificationEmail(
        "Account Login",
        req.session.user.email,
        req.session.user.username,
        new Date().toLocaleDateString(),
        `${(req.session.user.username, req.session.user.email)}`,
        { "X-Category": "Login Notification" }
      );
      // Send welcome email since there is passport authentication
      await sendWelcomeEmail(
        req.session.user.email,
        req.session.user.username,
        { "X-Category": "Welcome Email" }
      );
    } else {
      return res.status(401).json({ message: "Unauthorized" });
    }
    //Redirect user permently to frontend home page
    return res.status(301).redirect(`${process.env.CLIENT_URL}`);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

// NOTE: Will work on more endpoints
