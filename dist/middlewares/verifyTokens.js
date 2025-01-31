var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
dotenv.config();
import User from "../models/user.model.js";
const verifyTokens = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const sentCookie = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.token;
    try {
        if (!sentCookie) {
            res.status(401).json({
                success: false,
                message: "Please login and verify your account. Or create one",
            });
            return;
        }
        const foundUser = yield User.findOne({
            accessToken: sentCookie,
            accessTokenExpires: { $gt: Date.now() },
        });
        if (!foundUser) {
            res.status(403).json({
                success: false,
                message: "Invalid or expired token",
            });
            return;
        }
        jwt.verify(sentCookie, process.env.ACCESS_TOKEN_SECRET, { algorithms: ["HS256"] }, (error, decoded) => {
            if (error) {
                res.status(403).json({
                    message: "Invalid or expired token",
                });
                return;
            }
            req.user.id = decoded.id;
            req.user.username = decoded.username;
            req.user.email = decoded.email;
            req.user.role = decoded.role;
            next();
        });
    }
    catch (error) {
        const err = error;
        res.status(500).json({
            message: err.message || "Internal server error",
        });
    }
});
export default verifyTokens;
//# sourceMappingURL=verifyTokens.js.map