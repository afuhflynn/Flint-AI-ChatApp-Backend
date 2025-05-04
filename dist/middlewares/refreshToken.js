var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import logger from "../utils/loger.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
config();
export const refreshTokens = (req, res) => {
    const handler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            const sentAccessToken = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.token;
            if (!sentAccessToken) {
                return res.status(401).json({ message: "Login required to continue" });
            }
            // Find the user by refresh token
            const foundUser = yield User.findOne({
                accessToken: sentAccessToken,
                refreshTokenExpires: { $gt: Date.now() },
            });
            console.log(foundUser, sentAccessToken);
            if (!foundUser) {
                return res.status(403).json({ message: "Invalid refresh token" });
            }
            if (foundUser) {
                // Verify the refresh token
                jwt.verify(foundUser.refreshToken, process.env.REFRESH_TOKEN_SECRET, { algorithms: ["HS256"] }, (error, _) => __awaiter(void 0, void 0, void 0, function* () {
                    if (error) {
                        return res
                            .status(403)
                            .json({ message: "Invalid or expired refresh token" });
                    }
                    // Generate a new access token
                    const newAccessToken = jwt.sign({
                        id: foundUser._id,
                        username: foundUser.username,
                        email: foundUser.email,
                        role: foundUser.role,
                    }, process.env.ACCESS_TOKEN_SECRET, { algorithm: "HS256", expiresIn: "1h" });
                    // Update the user’s access token and expiration in the database
                    foundUser.accessToken = newAccessToken;
                    foundUser.accessTokenExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
                    yield foundUser.save();
                    // Set the new access token in the cookie
                    res.cookie("token", newAccessToken, {
                        httpOnly: true,
                        sameSite: "strict",
                        secure: process.env.APP_STATUS === "development" ? false : true,
                        maxAge: Date.now() + 60 * 60 * 1000, // 1 hour
                    });
                    return res.status(202); // Accepted
                }));
            }
        }
        catch (error) {
            logger.error(`Error refreshing cookies (tokens): ${error.message}`);
            return res
                .status(500)
                .json({ message: "Internal server error. Please try again later" });
        }
    });
    handler(req, res);
};
//# sourceMappingURL=refreshToken.js.map