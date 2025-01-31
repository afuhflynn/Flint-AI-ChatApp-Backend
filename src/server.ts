import express, { Request, Response, NextFunction } from "express";
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
import { RequestWithUser, UserSchemaTypes } from "./TYPES.js";
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

// **GitHub Authentication Route**
app.get(
  "/api/auth/users/github",
  passport.authenticate("github", { scope: ["user:email"], session: false })
);

// **GitHub OAuth Callback Route**
app.get(
  "/auth/github/callback",
  (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate(
      "github",
      { session: false },
      async (err: any, user: UserSchemaTypes, _: any) => {
        try {
          if (err) return next(err);
          if (!user) {
            return res.redirect(
              `${process.env.CLIENT_URL}/log-in?error=unauthorized`
            );
          }

          const foundUser = await User.findOne({
            githubId: (user as any).githubId,
          });

          if (foundUser) {
            return res.redirect(
              `${process.env.CLIENT_URL}/auth-success?token=${foundUser.accessToken}`
            );
          }

          // If the user is new, create an account and generate a JWT
          await githubLogin(req as Request & RequestWithUser, res);
        } catch (error) {
          next(error);
        }
      }
    )(req, res, next);
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
  logger.error(`404: ${req.url}`);
  if (req.accepts("json"))
    return res.status(404).json({ success: false, message: "Page not found!" });
  if (req.accepts("text")) return res.status(404).send("Page not found!");
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
