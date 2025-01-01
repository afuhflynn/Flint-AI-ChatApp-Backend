var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Router } from "express";
import { deleteUser, forgotPassword, logInUser, logOutUser, resetPassword, signUpUser, verifyUser, } from "../controllers/users.controller.js";
import verifyTokens from "../middlewares/verifyTokens.js";
const userRouter = Router();
userRouter.post("/sign-up", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield signUpUser(req, res);
    }
    catch (error) {
        console.error("Error in sign-up route:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}));
userRouter.post("/sign-in", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield logInUser(req, res);
    }
    catch (error) {
        console.error("Error in sign-up route:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}));
userRouter.put("/verify-account", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield verifyUser(req, res);
    }
    catch (error) {
        console.error("Error in sign-up route:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}));
userRouter.post("/log-out", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield logOutUser(req, res);
    }
    catch (error) {
        console.error("Error in sign-up route:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}));
userRouter.patch("/forgot-password", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield forgotPassword(req, res);
    }
    catch (error) {
        console.error("Error in sign-up route:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}));
userRouter.put("/reset-password/:token", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield resetPassword(req, res);
    }
    catch (error) {
        console.error("Error in sign-up route:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}));
userRouter.delete("/delete-account", verifyTokens, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield deleteUser(req, res);
    }
    catch (error) {
        console.error("Error in sign-up route:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}));
export default userRouter;
//# sourceMappingURL=users.router.js.map