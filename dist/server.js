var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express from "express";
import morgan from "morgan";
import cors from "cors";
import passport from "passport";
import cookieParser from "cookie-parser";
import { config } from "dotenv";
import { fileURLToPath } from "node:url";
import geminiRouter from "./routes/gemini.route.js";
import connectDB from "./config/db/connectDB.js";
import mongoose from "mongoose";
import path from "node:path";
import userRouter from "./routes/users.router.js";
import "./config/passportJs.js";
import { githubLogin } from "./controllers/users.controller.js";
import logger from "./utils/loger.js";
import User from "./models/user.model.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Initialize env vars
config();
// Connect to MongoDB
connectDB();
// Create a new express application instance
const app = express();
const port = process.env.PORT || 3000;
// Express middleware setup
app.use(cookieParser());
app.use(express.json());
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    optionsSuccessStatus: 200,
}));
app.use(express.urlencoded({ extended: true }));
app.set("trust proxy", 1);
app.use(morgan("dev"));
// Passport js init
app.use(passport.initialize());
// **GitHub Authentication Route**
app.get("/api/auth/users/github", passport.authenticate("github", { scope: ["user:email"], session: false }));
// **GitHub OAuth Callback Route**
app.get("/auth/github/callback", (req, res, next) => {
    passport.authenticate("github", { session: false }, (err, user, _) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (err)
                return next(err);
            if (!user) {
                return res.redirect(`${process.env.CLIENT_URL}/log-in?error=unauthorized`);
            }
            const foundUser = yield User.findOne({
                githubId: user.githubId,
            });
            if (foundUser) {
                return res.redirect(`${process.env.CLIENT_URL}/auth-success?token=${foundUser.accessToken}`);
            }
            // If the user is new, create an account and generate a JWT
            yield githubLogin(req, res);
        }
        catch (error) {
            next(error);
        }
    }))(req, res, next);
});
// Route handlers
app.use("/assist", geminiRouter);
app.use("/api/auth/users", userRouter);
app.get("/", (_, res) => {
    res.send("Hello, world!");
});
// Handle 404 errors
app.get("*", (req, res) => {
    logger.error(`404: ${req.url}`);
    if (req.accepts("json"))
        return res.status(404).json({ success: false, message: "Page not found!" });
    if (req.accepts("text"))
        return res.status(404).send("Page not found!");
    if (req.accepts("html"))
        return res
            .status(404)
            .sendFile(path.join(__dirname, "views", "404page.html"));
});
// Start server
mongoose.connection.once("open", () => {
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
});
//# sourceMappingURL=server.js.map