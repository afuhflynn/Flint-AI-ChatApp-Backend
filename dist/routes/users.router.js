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
import { loginUser, registerUser } from "../controllers/users.controller.js";
import passport from "passport";
const userRouter = Router();
// Extend the request object
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
    successRedirect: "/",
    failureRedirect: "/",
}), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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