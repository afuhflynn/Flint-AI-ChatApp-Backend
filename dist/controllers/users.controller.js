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
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import crypto from "crypto";
// Validate required fields
const validateRequiredFields = (fields, body) => {
    for (const field of fields) {
        if (!body[field]) {
            return `Field ${field} is required.`;
        }
    }
    return null;
};
// Middleware to check required fields for registration
export const validateRegisterFields = (req, res, next) => {
    const requiredFields = ["username", "password", "email"];
    const error = validateRequiredFields(requiredFields, req.body);
    if (error) {
        return res.status(400).json({ error });
    }
    next();
};
// Middleware to check required fields for login
export const validateLoginFields = (req, res, next) => {
    const requiredFields = ["username", "password"];
    const error = validateRequiredFields(requiredFields, req.body);
    if (error) {
        return res.status(400).json({ error });
    }
    next();
};
const secretKey = "your_secret_key"; // Replace with your actual secret key
// Register user
export const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password, email } = req.body;
        const newUser = new User({ username, password: password, email });
        yield newUser.save();
        const verificationCode = generateVerificationCode();
        yield sendVerificationEmail(email, verificationCode);
        res.status(201).json({
            message: "User registered successfully. Verification email sent.",
        });
    }
    catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});
// Login a user
export const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        const user = yield User.findOne({ username });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const isPasswordValid = yield bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid password" });
        }
        const token = jwt.sign({ userId: user._id }, secretKey, {
            expiresIn: "1h",
        });
        res.status(200).json({ token });
    }
    catch (error) {
        res.status(500).json({ error: "Internal server error" });
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
// Generate verification code
const generateVerificationCode = () => {
    return crypto.randomBytes(3).toString("hex").toUpperCase();
};
// Send verification email
const sendVerificationEmail = (email, code) => __awaiter(void 0, void 0, void 0, function* () {
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
    yield transporter.sendMail(mailOptions);
});
// Generate access token
export const generateAccessToken = (userId) => {
    return jwt.sign({ userId }, secretKey, { expiresIn: "1h" });
};
// Send notification email
export const sendNotificationEmail = (email, subject, message) => __awaiter(void 0, void 0, void 0, function* () {
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
    yield transporter.sendMail(mailOptions);
});
//# sourceMappingURL=users.controller.js.map