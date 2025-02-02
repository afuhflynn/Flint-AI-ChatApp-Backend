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
import { checkAuthState, deleteUserAccount, getUserProfile, loginUser, logoutUser, registerUser, requestPasswordReset, resendVerificationCode, resetPassword, sendDeleteAccountRequest, updateUserProfile, verifyUserAccountWithCode, verifyUserAccountWithToken, } from "../controllers/users.controller.js";
import passport from "passport";
const userRouter = Router();
// Create a new express application instance
const app = express();
// Passport js init
import "../config/passportJs.js";
app.use(passport.initialize());
app.use(passport.session());
userRouter.post("/sign-up", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield registerUser(req, res);
    }
    catch (error) {
        console.error("Error in sign-up route:", error);
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
        console.error("Error in sign-in route:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}));
userRouter.post("/log-out", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield logoutUser(req, res);
    }
    catch (error) {
        console.error("Error in log-out route:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}));
userRouter.post("/account-delete-request", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield checkAuthState(req, res, next);
        yield sendDeleteAccountRequest(req, res);
    }
    catch (error) {
        console.error("Error in account delete request route:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}));
userRouter.delete("/delete-account", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield checkAuthState(req, res, next);
        yield deleteUserAccount(req, res);
    }
    catch (error) {
        console.error("Error in account delete route:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}));
userRouter.get("/get-profile", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield checkAuthState(req, res, next);
        yield getUserProfile(req, res);
    }
    catch (error) {
        console.error("Error in user profile route:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}));
userRouter.put("/update-profile", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield checkAuthState(req, res, next);
        yield updateUserProfile(req, res);
    }
    catch (error) {
        console.error("Error in update profile route:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}));
userRouter.post("/verify-account-code", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield verifyUserAccountWithCode(req, res);
    }
    catch (error) {
        console.error("Error in verify account with code route:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}));
userRouter.post("/verify-account-token/:token", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield verifyUserAccountWithToken(req, res);
    }
    catch (error) {
        console.error("Error in verify account with token route:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}));
userRouter.post("/resend-verification-code", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield resendVerificationCode(req, res);
    }
    catch (error) {
        console.error("Error in resend verification code route:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}));
userRouter.post("/reset-password-request", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield requestPasswordReset(req, res);
    }
    catch (error) {
        console.error("Error in reset password request route:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}));
userRouter.put("/reset-password", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield resetPassword(req, res);
    }
    catch (error) {
        console.error("Error in reset password route:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}));
export default userRouter;
//# sourceMappingURL=users.router.js.map