import express, { Router, Request, Response } from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/users.controller.js";
import passport from "passport";

const userRouter = Router();

// Create a new express application instance
const app = express();
// Passport js init
import "../config/passportJs.js";
import { updateUserSession } from "../middlewares/updateUserSession.js";
app.use(passport.initialize());
app.use(passport.session());

userRouter.post("/sign-up", async (req: Request, res: Response) => {
  try {
    await registerUser(req, res);
  } catch (error) {
    console.error("Error in sign-up route:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
userRouter.post(
  "/sign-in",
  passport.authenticate("local"),
  updateUserSession,
  async (req: Request, res: Response) => {
    try {
      await loginUser(req, res);
    } catch (error) {
      console.error("Error in sign-in route:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);
userRouter.post("/log-out", async (req: Request, res: Response) => {
  try {
    await logoutUser(req, res);
  } catch (error) {
    console.error("Error in log-out route:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default userRouter;
