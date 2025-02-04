var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express, { Router } from "express";
import { deleteUserAccount, getUserProfile, loginUser, logoutUser, registerUser, requestPasswordReset, resendVerificationCode, resetPassword, sendDeleteAccountRequest, updateUserProfile, verifyUserAccountWithCode, verifyUserAccountWithToken, } from "../controllers/users.controller.js";
import passport from "passport";
const userRouter = Router();
// Create a new express application instance
const app = express();
// Passport js init
import "../config/passportJs.js";
import logger from "../utils/loger.js";
import { checkAuthState } from "../middlewares/verifyAuth.js";
import verifyTokens from "../middlewares/verifyTokens.js";
import { refreshTokens } from "../middlewares/refreshToken.js";
app.use(passport.initialize());
app.use(passport.session());
userRouter.post("/sign-up", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        registerUser(req, res);
    }
    catch (error) {
        logger.error(`Error in sign up route: ${error.message}`);
        res.status(500).json({ error: "Internal server error" });
    }
}));
userRouter.post("/sign-in", passport.authenticate("local", {
    session: false,
    failureRedirect: `${process.env.CLIENT_URL}/auth/login-in`,
}), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        loginUser(req, res);
    }
    catch (error) {
        logger.error(`Error in sign in route: ${error.message}`);
        res.status(500).json({ error: "Internal server error" });
    }
}));
// NOTE: Protected routes
userRouter.post("/log-out", verifyTokens, checkAuthState, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logoutUser(req, res);
    }
    catch (error) {
        logger.error(`Error in account delete route: ${error.message}`);
        res.status(500).json({ error: "Internal server error" });
    }
}));
userRouter.post("/account-delete-request", verifyTokens, checkAuthState, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        sendDeleteAccountRequest(req, res);
    }
    catch (error) {
        logger.error(`Error in account delete route: ${error.message}`);
        res.status(500).json({ error: "Internal server error" });
    }
}));
userRouter.delete("/delete-account", verifyTokens, checkAuthState, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        deleteUserAccount(req, res);
    }
    catch (error) {
        logger.error(`Error in account delete route: ${error.message}`);
        res.status(500).json({ error: "Internal server error" });
    }
}));
userRouter.get("/profile", verifyTokens, checkAuthState, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        getUserProfile(req, res);
    }
    catch (error) {
        logger.error(`Error in account delete route: ${error.message}`);
        res.status(500).json({ error: "Internal server error" });
    }
}));
userRouter.post("/refresh-token", refreshTokens);
userRouter.put("/update-profile", verifyTokens, checkAuthState, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        updateUserProfile(req, res);
    }
    catch (error) {
        logger.error(`Error in account delete route: ${error.message}`);
        res.status(500).json({ error: "Internal server error" });
    }
}));
// NOTE: Open routes
userRouter.post("/verify-account-code", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        verifyUserAccountWithCode(req, res);
    }
    catch (error) {
        logger.error(`Error in verify account with code route: ${error.message}`);
        res.status(500).json({ error: "Internal server error" });
    }
}));
userRouter.post("/verify-account-token/:token", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        verifyUserAccountWithToken(req, res);
    }
    catch (error) {
        logger.error(`Error in verify account with token route: ${error.message}`);
        res.status(500).json({ error: "Internal server error" });
    }
}));
userRouter.post("/resend-verification-code", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        resendVerificationCode(req, res);
    }
    catch (error) {
        logger.error(`Error in resend verification email route: ${error.message}`);
        res.status(500).json({ error: "Internal server error" });
    }
}));
userRouter.post("/reset-password-request", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        requestPasswordReset(req, res);
    }
    catch (error) {
        logger.error(`Error in reset password request route: ${error.message}`);
        res.status(500).json({ error: "Internal server error" });
    }
}));
userRouter.put("/reset-password/:token", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        resetPassword(req, res);
    }
    catch (error) {
        logger.error(`Error in reset password route: ${error.message}`);
        res.status(500).json({ error: "Internal server error" });
    }
}));
export default userRouter;
//# sourceMappingURL=users.router.js.map