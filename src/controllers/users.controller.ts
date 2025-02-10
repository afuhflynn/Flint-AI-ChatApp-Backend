import { Request, Response } from "express";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import crypto from "node:crypto";
import { v2 as cloudinary } from "cloudinary";
import { config } from "dotenv";
config();
import {
  sendAccountDeleteAdminNotificationEmail,
  sendAccountDeleteEmail,
  sendNotificationEmail,
  sendPasswordResetEmail,
  sendVerificationEmail,
  sendWelcomeEmail,
} from "../utils/Emails/send.emails.js";
import generateVerificationCode from "../utils/generateVerificationCode.js";
import { RequestWithUser } from "../TYPES.js";
import generateResetToken from "../utils/generateResetToken.js";
import { format } from "date-fns";
import generateTokens from "../utils/generateTokens.js";
import logger from "../utils/loger.js";

// Register user
export const registerUser = async (req: Request, res: Response) => {
  const { username, password, email } = req.body;
  // Check if all required fields are provided
  if (!username || !password || !email)
    return res.status(400).json({ message: "All fields are required" });
  try {
    // Check if user already exists
    const userNameExists = await User.findOne({ username: username });
    if (userNameExists)
      return res.status(400).json({
        message: "User with this username already exists. You can login",
      });
    const userEmailExists = await User.findOne({ email: email });
    if (userEmailExists)
      return res.status(400).json({
        message: "User with this email already exists. You can login",
      });
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Generate a new verification token
    const token: string = await crypto.randomBytes(60).toString("hex");
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // one day
    // Generate new verification code
    const verificationCode: string = generateVerificationCode();
    const newUser = new User({
      username,
      password: hashedPassword,
      email,
      verificationCode,
      verificationCodeExpires: expiresAt,
      verificationToken: token,
      verificationTokenExpires: expiresAt,
    });
    await newUser.save();

    await sendVerificationEmail(verificationCode, email, username, token, {
      "X-Category": "Verification Email",
    });

    return res.status(201).json({
      message: "User registered successfully. Verification email sent.",
    });
  } catch (error: any | { message: string }) {
    logger.error(`Error signing up user: ${error.message}`);
    return res
      .status(500)
      .json({ message: "Internal server error. Please try again later" });
  }
};

// Login a user
export const loginUser = async (
  req: Request & RequestWithUser,
  res: Response
) => {
  try {
    const loggedInUser = await User.findOne({
      email: req.user.email,
    });

    if (loggedInUser) {
      // Save a new access token on client browser
      // Set JWT as an httpOnly cookie
      res.cookie("token", loggedInUser.accessToken, {
        httpOnly: true, // Makes the cookie inaccessible via JavaScript
        secure: process.env.APP_STATUS === "development" ? false : true, // Set to true if you're using HTTPS
        sameSite: "strict",
        maxAge: Date.now() + 60 * 60 * 1000, // 1 hour
      });

      //send notification email
      await sendNotificationEmail(
        "Account Login",
        loggedInUser.email,
        loggedInUser.username,
        new Date().toLocaleDateString(),
        `${loggedInUser.username}, ${loggedInUser.email}`,
        { "X-Category": "Login Notification" }
      );
      return res.status(200).json({ message: "Logged in successfully" });
    }
  } catch (error: any | { message: string }) {
    logger.error(`Error signing in user: ${error.message}`);
    return res
      .status(500)
      .json({ message: "Internal server error. Please try again later" });
  }
};

// NOTE: Protected routes
// Logout user
export const logoutUser = async (
  req: Request & RequestWithUser,
  res: Response
) => {
  try {
    const user = await User.findOne({
      _id: req.user.id,
      email: req.user.email,
      isVerified: true,
    });
    if (!user) {
      return res.status(403).json({ error: "User not found" });
    }
    // send account notificaiton email
    await sendNotificationEmail(
      "Account Logout",
      req.user.email,
      req.user.username,
      new Date().toLocaleDateString(),
      `${(req.user.username, req.user.email)}`,
      { "X-Category": "Logout Notification" }
    );
    // Clear cookies
    res.clearCookie("token");
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error: any | { message: string }) {
    logger.error(`Error signing out user: ${error.message}`);
    return res
      .status(500)
      .json({ message: "Internal server error. Please try again later" });
  }
};

// Send user account delete request for warning
export const sendDeleteAccountRequest = async (
  req: Request & RequestWithUser,
  res: Response
) => {
  try {
    const user = await User.findById(req.user.id);
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
  } catch (error: any | { message: string }) {
    logger.error(`Error sending account delete request: ${error.message}`);
    return res
      .status(500)
      .json({ message: "Internal server error. Please try again later" });
  }
};

// Delete user account
export const deleteUserAccount = async (
  req: Request & RequestWithUser,
  res: Response
) => {
  const { token } = req.params;
  const { message } = req.body;
  // Check if user provided a message
  if (!message)
    return res
      .status(400)
      .json({ message: "Must provide a message to proceed!" });
  try {
    const deletedUser = await User.deleteOne({
      _id: req.user.id,
      accountDeleteToken: token,
    });
    if (!deletedUser) return res.status(404).json({ error: "User not found" });

    // Send user account delete email
    await sendNotificationEmail(
      "Account Deletion",
      req.user.email,
      req.user.username,
      format(new Date(), "YYYY:MM:dd"),
      `${(req.user.username, req.user.email)}`,
      { "X-Category": "Account Deletion Notification" }
    );

    // Send email to notify admin that a user account has been deleted
    await sendAccountDeleteAdminNotificationEmail(
      req.user.email,
      req.user.username,
      "User account deleted",
      message,
      new Date().toLocaleDateString(),
      { "X-Category": "Account deletion" }
    );

    res.clearCookie("token");

    return res
      .status(200)
      .json({ message: "User account deleted successfully" });
  } catch (error: any | { message: string }) {
    logger.error(`Error deleting user account: ${error.message}`);
    return res
      .status(500)
      .json({ message: "Internal server error. Please try again later" });
  }
};

// Get user profile
export const getUserProfile = async (
  req: Request & RequestWithUser,
  res: Response
) => {
  try {
    const user = await User.findOne({
      _id: req.user.id,
      email: req.user.email,
      isVerified: true,
    });

    if (!user) {
      return res.status(403).json({ message: "User not found" });
    }
    return res.status(200).json({ user: user });
  } catch (error: any | { message: string }) {
    logger.error(`Error fetching user profile: ${error.message}`);
    return res
      .status(500)
      .json({ message: "Internal server error. Please try again later" });
  }
};

// Update user profile
export const updateUserProfile = async (
  req: Request & RequestWithUser,
  res: Response
) => {
  try {
    const { username, password, avatarUrl, firstName, lastName } = req.body;
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
        public_id: `Flint ai user ${username} profile avatar`,
      });

      newAvatarUrl = uploadResult.url;
    });
    const updatedData: any = { username }; // Updated user data object
    if (password) updatedData.password = await bcrypt.hash(password, 10);
    if (avatarUrl) updatedData.avatarUrl = newAvatarUrl;
    if (firstName) updatedData.name.firstName = firstName;
    if (lastName) updatedData.name.firstName = lastName;

    // Fetch user and updata if the fields were provided
    const updatedUser = await User.findByIdAndUpdate(req.user.id, updatedData, {
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
  } catch (error: any | { message: string }) {
    logger.error(`Error updating user profile: ${error.message}`);
    return res
      .status(500)
      .json({ message: "Internal server error. Please try again later" });
  }
};

// NOTE: Open routes
// Verify user account
export const verifyUserAccountWithCode = async (
  req: Request,
  res: Response
) => {
  const { code } = req.body;
  if (!code || code.length < 6)
    return res.status(400).json({
      success: false,
      message: "You must provide a valid verification code",
    });
  try {
    // Find for a user with verification code that has not expired
    const user = await User.findOne({
      verificationCode: code,
      isVerified: false,
      verificationCodeExpires: { $gt: Date.now() },
    });
    if (!user)
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification code",
      });
    user.isVerified = true;
    user.verificationCode = "";
    user.verificationCodeExpires = new Date(Date.now());
    user.verificationToken = "";
    user.verificationTokenExpires = new Date(Date.now());
    await user.save();
    await sendWelcomeEmail(user.email, user.username, {
      "X-Category": "Welcome Email",
    });
    return res.status(200).json({ message: "Account verified successfully" });
  } catch (error: any | { message: string }) {
    logger.error(`Error verifying user account with code: ${error.message}`);
    return res
      .status(500)
      .json({ message: "Internal server error. Please try again later" });
  }
};
// Verify user account
export const verifyUserAccountWithToken = async (
  req: Request,
  res: Response
) => {
  const { token } = req.params;
  if (!token)
    return res
      .status(400)
      .json({ success: false, message: "A verification token is expected" });
  try {
    // Find for a user with verification code that has not expired
    const user = await User.findOne({
      verificationToken: token,
      isVerified: false,
      verificationTokenExpires: { $gt: Date.now() },
    });
    if (!user)
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification token",
      });
    user.isVerified = true;
    user.verificationCode = "";
    user.verificationCodeExpires = new Date(Date.now());
    user.verificationToken = "";
    user.verificationTokenExpires = new Date(Date.now());
    await user.save();
    await sendWelcomeEmail(user.email, user.username, {
      "X-Category": "Welcome Email",
    });
    return res.status(200).json({ message: "Account verified successfully" });
  } catch (error: any | { message: string }) {
    logger.error(`Error verifying user account with token: ${error.message}`);
    return res
      .status(500)
      .json({ message: "Internal server error. Please try again later" });
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
      verificationCodeExpires: { $gt: Date.now() },
    });
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    if (user.isVerified)
      return res.status(400).json({ success: false, message: "User verified" });
    // Generate a new verification token
    const token: string = await crypto.randomBytes(60).toString("hex");
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    // Generate new verification code
    const verificationCode: string = generateVerificationCode();
    user.verificationCode = verificationCode;
    user.verificationCodeExpires = expiresAt;
    user.verificationToken = token;
    user.verificationTokenExpires = expiresAt;
    await user.save();
    await sendVerificationEmail(verificationCode, email, user.username, token, {
      "X-Category": "Verification Email",
    });
    return res.status(200).json({ message: "Verification email sent" });
  } catch (error: any | { message: string }) {
    logger.error(`Error resending verification email: ${error.message}`);
    return res
      .status(500)
      .json({ message: "Internal server error. Please try again later" });
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
      `${process.env.CLIENT_URL}/auth/reset-password/${resetToken}`,
      {
        "X-Category": "Password Reset Email",
      }
    );
    return res.status(200).json({ message: "Password reset email sent" });
  } catch (error: any | { message: string }) {
    logger.error(`Error sending password reset request: ${error.message}`);
    return res
      .status(500)
      .json({ message: "Internal server error. Please try again later" });
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
      resetPasswordTokenExpires: { $gt: Date.now() },
    });
    if (!user)
      return res.status(403).json({
        success: false,
        message: "Invalid or expired reset link. Request another one",
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
    // Clear browser cookie
    res.clearCookie("token");
    return res.status(200).json({ message: "Password reset successfully" });
  } catch (error: any | { message: string }) {
    logger.error(`Error resetting user password: ${error.message}`);
    return res
      .status(500)
      .json({ message: "Internal server error. Please try again later" });
  }
};

// Handle github login
export const githubLogin = async (
  req: Request & RequestWithUser,
  res: Response
) => {
  try {
    const foundUser = await User.findOne({
      githubId: (req.user as any).githubId,
    });

    if (foundUser) {
      const {
        accessToken,
        accessTokenExpiresAt,
        refreshToken,
        refreshTokenExpiresAt,
      } = await generateTokens(
        foundUser._id,
        foundUser.email,
        foundUser.username,
        foundUser.role
      );
      foundUser.accessToken = accessToken;
      foundUser.accessTokenExpires = accessTokenExpiresAt;
      foundUser.refreshToken = refreshToken;
      foundUser.refreshTokenExpires = refreshTokenExpiresAt;
      await foundUser.save();

      // Set JWT as an httpOnly cookie
      res.cookie("token", accessToken, {
        httpOnly: true, // Makes the cookie inaccessible via JavaScript
        secure: process.env.APP_STATUS === "development" ? false : true, // Set to true if you're using HTTPS
        sameSite: "strict",
        maxAge: Date.now() + 60 * 60 * 1000, // 1 hour
      });

      // Send welcome email
      await sendWelcomeEmail(foundUser.email, foundUser.username, {
        "X-Category": "Welcome Email",
      });

      // Redirect or send response
      return res.redirect(`${process.env.CLIENT_URL}/chat-bot/chats/new-chat`);
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error: any | { message: string }) {
    logger.error(`Error login in user with github: ${error.message}`);
    return res
      .status(500)
      .json({ message: "Internal server error. Please try again later" });
  }
};
