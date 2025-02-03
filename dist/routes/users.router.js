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
app.use(passport.initialize());
app.use(passport.session());
userRouter.post("/sign-up", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield registerUser(req, res);
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
userRouter.post("/log-out", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield verifyTokens(req, res, next);
        yield checkAuthState(req, res, next);
        yield logoutUser(req, res);
    }
    catch (error) {
        logger.error(`Error in log out route: ${error.message}`);
        res.status(500).json({ error: "Internal server error" });
    }
}));
userRouter.post("/account-delete-request", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield verifyTokens(req, res, next);
        yield checkAuthState(req, res, next);
        yield sendDeleteAccountRequest(req, res);
    }
    catch (error) {
        logger.error(`Error in account delete request route: ${error.message}`);
        res.status(500).json({ error: "Internal server error" });
    }
}));
userRouter.delete("/delete-account", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield verifyTokens(req, res, next);
        yield checkAuthState(req, res, next);
        yield deleteUserAccount(req, res);
    }
    catch (error) {
        logger.error(`Error in account delete route: ${error.message}`);
        res.status(500).json({ error: "Internal server error" });
    }
}));
userRouter.get("/profile", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield verifyTokens(req, res, next);
        yield checkAuthState(req, res, next);
        yield getUserProfile(req, res);
    }
    catch (error) {
        logger.error(`Error in get user profile route: ${error.message}`);
        res.status(500).json({ error: "Internal server error" });
    }
}));
userRouter.put("/update-profile", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield verifyTokens(req, res, next);
        yield checkAuthState(req, res, next);
        yield updateUserProfile(req, res);
    }
    catch (error) {
        logger.error(`Error in update user profile route: ${error.message}`);
        res.status(500).json({ error: "Internal server error" });
    }
}));
userRouter.post("/verify-account-code", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield verifyUserAccountWithCode(req, res);
    }
    catch (error) {
        logger.error(`Error in verify account with code route: ${error.message}`);
        res.status(500).json({ error: "Internal server error" });
    }
}));
userRouter.post("/verify-account-token/:token", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield verifyUserAccountWithToken(req, res);
    }
    catch (error) {
        logger.error(`Error in verify account with token route: ${error.message}`);
        res.status(500).json({ error: "Internal server error" });
    }
}));
userRouter.post("/resend-verification-code", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield resendVerificationCode(req, res);
    }
    catch (error) {
        logger.error(`Error in resend verification email route: ${error.message}`);
        res.status(500).json({ error: "Internal server error" });
    }
}));
userRouter.post("/reset-password-request", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield requestPasswordReset(req, res);
    }
    catch (error) {
        logger.error(`Error in reset password request route: ${error.message}`);
        res.status(500).json({ error: "Internal server error" });
    }
}));
userRouter.put("/reset-password/:token", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield resetPassword(req, res);
    }
    catch (error) {
        logger.error(`Error in reset password route: ${error.message}`);
        res.status(500).json({ error: "Internal server error" });
    }
}));
export default userRouter;
//# sourceMappingURL=users.router.js.map