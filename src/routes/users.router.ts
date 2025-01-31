import express, { Router, Request, Response, NextFunction } from "express";
import {
  checkAuthState,
  deleteUserAccount,
  getUserProfile,
  loginUser,
  logoutUser,
  registerUser,
  sendDeleteAccountRequest,
  updateUserProfile,
} from "../controllers/users.controller.js";
import passport from "passport";

const userRouter = Router();

// Create a new express application instance
const app = express();
// Passport js init
import "../config/passportJs.js";
import { RequestWithUser } from "../TYPES.js";
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
  async (req: Request, res: Response) => {
    try {
      await loginUser(req as Request & RequestWithUser, res);
    } catch (error) {
      console.error("Error in sign-in route:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

userRouter.post("/log-out", async (req: Request, res: Response) => {
  try {
    await logoutUser(req as Request & RequestWithUser, res);
  } catch (error) {
    console.error("Error in log-out route:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

userRouter.post(
  "/account-delete-request",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await checkAuthState(req as Request & RequestWithUser, res, next);
      await sendDeleteAccountRequest(req as Request & RequestWithUser, res);
    } catch (error) {
      console.error("Error in log-out route:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

userRouter.post(
  "/delete-account",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await checkAuthState(req as Request & RequestWithUser, res, next);
      await deleteUserAccount(req as Request & RequestWithUser, res);
    } catch (error) {
      console.error("Error in log-out route:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

userRouter.delete(
  "/delete-account",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await checkAuthState(req as Request & RequestWithUser, res, next);
      await getUserProfile(req as Request & RequestWithUser, res);
    } catch (error) {
      console.error("Error in log-out route:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

userRouter.put(
  "/update-profile",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await checkAuthState(req as Request & RequestWithUser, res, next);
      await updateUserProfile(req as Request & RequestWithUser, res);
    } catch (error) {
      console.error("Error in log-out route:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

userRouter.put(
  "/update-profile",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await checkAuthState(req as Request & RequestWithUser, res, next);
      await updateUserProfile(req as Request & RequestWithUser, res);
    } catch (error) {
      console.error("Error in log-out route:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

export default userRouter;
