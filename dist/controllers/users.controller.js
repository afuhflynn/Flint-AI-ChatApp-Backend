var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import crypto from "node:crypto";
import { v2 as cloudinary } from "cloudinary";
import { sendAccountDeleteEmail, sendNotificationEmail, sendPasswordResetEmail, sendVerificationEmail, sendWelcomeEmail, } from "../utils/Emails/send.emails.js";
import generateVerificationCode from "../utils/generateVerificationCode.js";
import generateResetToken from "../utils/generateResetToken.js";
// Register user
export const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password, email } = req.body;
    // Check if all required fields are provided
    if (!username || !password || !email)
        return res
            .status(400)
            .json({ success: false, message: "All fields are required" });
    try {
        // Check if user already exists
        const user = yield User.findOne({ username, email });
        if (user)
            return res
                .status(400)
                .json({ success: false, message: "User already exists" });
        // Hash the password
        const hashedPassword = yield bcrypt.hash(password, 10);
        const verificationCode = generateVerificationCode();
        // Verification expires at date
        const verificationCodeExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
        const newUser = new User({
            username,
            password: hashedPassword,
            email,
            verificationCode,
            verificationCodeExpires,
        });
        yield newUser.save();
        yield sendVerificationEmail(verificationCode, email, username, {
            "X-Category": "Verification Email",
        });
        return res.status(201).json({
            message: "User registered successfully. Verification email sent.",
        });
    }
    catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
});
// Login a user
export const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        // Send welcome email since there is passport authentication
        if (((_a = req.session.user) === null || _a === void 0 ? void 0 : _a.email) && ((_b = req.session.user) === null || _b === void 0 ? void 0 : _b.username))
            yield sendWelcomeEmail(req.session.user.email, req.session.user.username, {
                "X-Category": "Welcome Email",
            });
        return res.status(200).json({ message: "Logged in successfully" });
    }
    catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
});
// Logout user
export const logoutUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        req.session.destroy((error) => {
            if (error) {
                return res.status(500).json({ message: "Internal server error" });
            }
            return res.status(200).json({ message: "Logged out successfully" });
        });
    }
    catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
});
// Send user account delete request for warning
export const sendDeleteAccountRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        let userId = "";
        if ((_a = req.session.user) === null || _a === void 0 ? void 0 : _a.id)
            userId = req.session.user.id;
        const user = yield User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const token = yield crypto.randomBytes(60).toString("hex");
        yield sendAccountDeleteEmail(user.email, user.username, `${process.env.CLIENT_URL}/delete-account/${user._id}/${token}`, { "X-Category": "Account Delete Email" });
        return res.status(200).json({ message: "Account deletion request sent" });
    }
    catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
});
// Delete user account
export const deleteUserAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        let userId = "";
        if ((_a = req.session.user) === null || _a === void 0 ? void 0 : _a.id)
            userId = req.session.user.id; // Assuming userId is set in the request by an auth middleware
        const deletedUser = yield User.findByIdAndDelete(userId);
        if (!deletedUser) {
            return res.status(404).json({ error: "User not found" });
        }
        // Send account delete notification email
        yield sendNotificationEmail("Account Deletion", deletedUser.email, deletedUser.username, new Date().toLocaleDateString(), `${(deletedUser.username, deletedUser.email)}`, { "X-Category": "Account Deletion Notification" });
        return res
            .status(200)
            .json({ message: "User account deleted successfully" });
    }
    catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
});
// Get user profile
export const getUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        let userId = "";
        if ((_a = req.session.user) === null || _a === void 0 ? void 0 : _a.id)
            userId = req.session.user.id;
        const user = yield User.findById(userId);
        if (!user) {
            return res.status(403).json({ error: "User not found" });
        }
        res.status(200).json(user);
    }
    catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});
// Update user profile
export const updateUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        let userId = "";
        if ((_a = req.session.user) === null || _a === void 0 ? void 0 : _a.id)
            userId = req.session.user.id;
        const { username, password, avatarUrl } = req.body;
        // Post avatarUrl to cloudinary before storing in db
        let newAvatarUrl = "";
        (function () {
            return __awaiter(this, void 0, void 0, function* () {
                cloudinary.config({
                    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
                    api_key: process.env.CLOUDINARY_API_KEY,
                    api_secret: process.env.CLOUDINARY_API_SECRET,
                });
                // Upload user avatar image
                const uploadResult = yield cloudinary.uploader.upload(avatarUrl, {
                    public_id: "Flint ai user avatar",
                });
                newAvatarUrl = uploadResult.url;
            });
        });
        const updatedData = { username };
        if (password)
            updatedData.password = yield bcrypt.hash(password, 10);
        if (avatarUrl)
            updatedData.avatarUrl = newAvatarUrl;
        const updatedUser = yield User.findByIdAndUpdate(userId, updatedData, {
            new: true,
        });
        if (!updatedUser) {
            return res.status(403).json({ error: "User not found" });
        }
        yield sendNotificationEmail("Profile Update", updatedUser.email, updatedUser.username, new Date().toLocaleDateString(), `${(updatedUser.username, updatedUser.email)}`, { "X-Category": "Profile Update Notification" });
        res.status(200).json(updatedUser);
    }
    catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});
// Verify user account
export const verifyUserAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { code } = req.body;
    if (!code)
        return res
            .status(400)
            .json({ success: false, message: "Verification code is required" });
    try {
        // Find for a user with verification code that has not expired
        const user = yield User.findOne({
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
        yield user.save();
        yield sendWelcomeEmail(user.email, user.username, {
            "X-Category": "Welcome Email",
        });
        return res.status(200).json({ message: "User account verified" });
    }
    catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
});
// Resend verification code
export const resendVerificationCode = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    if (!email)
        return res
            .status(400)
            .json({ success: false, message: "Email is required" });
    try {
        const user = yield User.findOne({
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
        const verificationCode = generateVerificationCode();
        user.verificationCode = verificationCode;
        user.verificationCodeExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
        yield user.save();
        yield sendVerificationEmail(verificationCode, email, user.username, {
            "X-Category": "Verification Email",
        });
        return res.status(200).json({ message: "Verification email sent" });
    }
    catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
});
// Request to reset password
export const requestPasswordReset = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    if (!email)
        return res
            .status(400)
            .json({ success: false, message: "Email is required" });
    try {
        const user = yield User.findOne({ email });
        if (!user)
            return res
                .status(403)
                .json({ success: false, message: "User not found" });
        const { resetToken, expiresAt } = yield generateResetToken();
        user.resetPasswordToken = resetToken;
        user.resetPasswordTokenExpires = expiresAt;
        yield user.save();
        yield sendPasswordResetEmail(email, user.username, `${process.env.CLIENT_URL}/reset-password/${resetToken}`, {
            "X-Category": "Password Reset Email",
        });
        return res.status(200).json({ message: "Password reset email sent" });
    }
    catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
});
// Reset password
export const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.params;
    const { password } = req.body;
    if (!password)
        return res
            .status(400)
            .json({ success: false, message: "A valid password is required" });
    try {
        const user = yield User.findOne({
            resetPasswordToken: token,
            resetPasswordTokenExpires: { $gt: new Date(Date.now()) },
        });
        if (!user)
            return res.status(403).json({
                success: false,
                message: "Invalid or expired reset link. Try again later",
            });
        user.password = yield bcrypt.hash(password, 10);
        user.resetPasswordToken = "";
        user.resetPasswordTokenExpires = undefined;
        yield user.save();
        sendNotificationEmail("Password Reset", user.email, user.username, new Date().toLocaleDateString(), `${(user.username, user.email)}`, { "X-Category": "Password Reset Notification" });
        return res.status(200).json({ message: "Password reset successfully" });
    }
    catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
});
// Check auth state
export const checkAuthState = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        let userId = "";
        if ((_a = req.session.user) === null || _a === void 0 ? void 0 : _a.id)
            userId = req.session.user.id;
        const user = yield User.findById(userId);
        if (!user) {
            return res
                .status(401)
                .json({ success: false, message: "User not found" });
        }
        return res.status(200).json({ success: true, user });
    }
    catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
});
// NOTE: Will work on more endpoints
//# sourceMappingURL=users.controller.js.map