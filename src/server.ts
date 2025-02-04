import express, { Request, Response } from "express";
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
import { RequestWithUser } from "./TYPES.js";
import userRouter from "./routes/users.router.js";
import "./config/passportJs.js";
import { githubLogin } from "./controllers/users.controller.js";
import logger from "./utils/loger.js";

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
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    optionsSuccessStatus: 200,
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Passport js init
app.use(passport.initialize());

// **GitHub Authentication Route**
app.get(
  "/api/auth/users/github",
  passport.authenticate("github", {
    scope: ["user:email", "user:password"],
    session: false, // Disable session
    failureRedirect: `${process.env.CLIENT_URL}/auth/login-in`,
    successRedirect: `${process.env.CLIENT_URL}/chat-bot/chats/new-chat`,
  })
);

// **GitHub OAuth Callback Route**
app.get(
  "/auth/github/callback",
  passport.authenticate("github", {
    session: false,
    failureRedirect: `${process.env.CLIENT_URL}/auth/login-in`,
  }),
  async (req: Request, res: Response) => {
    try {
      githubLogin(req as Request & RequestWithUser, res);
    } catch (error: any | { message: string }) {
      logger.error(`Error login in with github: ${error.message}`);
      res.status(500).json({ message: error });
    }
  }
);

// Route handlers
app.use("/assist", geminiRouter);
app.use("/api/auth/users", userRouter);

app.get("/", (_: Request, res: Response) => {
  res.send("Hello, world!");
});

// Handle 404 errors
app.get("*", (req: Request, res: Response) => {
  logger.error(`404 Error: ${req.originalUrl}`);

  if (req.accepts("json")) {
    res.status(404).json({ message: "Resource not found!" });
  } else if (req.accepts("text")) {
    res.status(404).send("Resource not found!");
  } else {
    res.status(404).sendFile(path.join(__dirname, "views", "404page.html"));
  }
});

// Start server
mongoose.connection.once("open", () => {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
});
