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
import { loginUser, registerUser } from "../controllers/users.controller.js";
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
userRouter.post("/sign-in", passport.authenticate("local"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield loginUser(req, res);
    }
    catch (error) {
        console.error("Error in sign-up route:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}));
export default userRouter;
//# sourceMappingURL=users.router.js.map