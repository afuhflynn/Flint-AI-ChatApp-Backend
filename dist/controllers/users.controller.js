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
import { sendVerificationEmail, sendWelcomeEmail, } from "../utils/Emails/send.emails.js";
import generateVerificationCode from "../utils/generateVerificationCode.js";
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
        return res.status(500).json({ error: "Internal server error" });
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
        return res.status(500).json({ error: "Internal server error" });
    }
});
// Get user profile
export const getUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.id; // Assuming userId is set in the request by an auth middleware
        const user = yield User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json(user);
    }
    catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});
// Update user profile
export const updateUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.id; // Assuming userId is set in the request by an auth middleware
        const { username, password } = req.body;
        const updatedData = { username };
        if (password) {
            updatedData.password = yield bcrypt.hash(password, 10);
        }
        const updatedUser = yield User.findByIdAndUpdate(userId, updatedData, {
            new: true,
        });
        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json(updatedUser);
    }
    catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});
// Delete user account
export const deleteUserAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.id; // Assuming userId is set in the request by an auth middleware
        const deletedUser = yield User.findByIdAndDelete(userId);
        if (!deletedUser) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json({ message: "User account deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});
//# sourceMappingURL=users.controller.js.map