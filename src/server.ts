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
import { UserSchemaTypes } from "./TYPES.js";
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

// Extend express-session's SessionData
declare module "express-session" {
  interface SessionData {
    visited?: boolean;
    userId: "";
    user: UserSchemaTypes | null;
  }
}

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
app.set("trust proxy", 1);
app.use(morgan("dev"));

// Passport js init
app.use(passport.initialize());
app.use(passport.session());

// Routes to create user account for github and locally
app.get(
  "/api/auth/users/github",
  passport.authenticate("github", {
    scope: ["user:email"],
    successRedirect: `${process.env.CLIENT_URL}`, // Redirect to frontend react home page
    failureRedirect: `${process.env.CLIENT_URL}/log-in`, // Redirect to frontend react login page
  })
);

app.get(
  "/auth/github/callback",
  passport.authenticate("github", {
    failureRedirect: `${process.env.CLIENT_URL}/log-in`,
  }),
  (req: Request, res: Response) => {
    githubLogin(req, res);
  }
);
// Route handlers
app.use("/assist", geminiRouter);
app.use("/api/auth/users", userRouter);

app.get("/", (_: Request, res: Response) => {
  res.send("Hello, world!");
});

// Target wrong routes
app.get("*", (req, res) => {
  logger.error(`404: ${req.url}`);
  if (req.accepts("json"))
    res.status(404).json({ success: false, message: "Page not found!" });
  if (req.accepts("text")) res.status(404).send("Page not found!");
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
