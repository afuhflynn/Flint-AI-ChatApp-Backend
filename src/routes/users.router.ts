import express, { Router, Request, Response } from "express";
import {
  deleteUserAccount,
  getUserProfile,
  loginUser,
  logoutUser,
  registerUser,
  requestPasswordReset,
  resendVerificationCode,
  resetPassword,
  sendDeleteAccountRequest,
  updateUserProfile,
  verifyUserAccountWithCode,
  verifyUserAccountWithToken,
} from "../controllers/users.controller.js";
import passport from "passport";

const userRouter = Router();

// Create a new express application instance
const app = express();
// Passport js init
import "../config/passportJs.js";
import { RequestWithUser } from "../TYPES.js";
import logger from "../utils/loger.js";
import { checkAuthState } from "../middlewares/verifyAuth.js";
import verifyTokens from "../middlewares/verifyTokens.js";
app.use(passport.initialize());
app.use(passport.session());

userRouter.post("/sign-up", async (req: Request, res: Response) => {
  try {
    registerUser(req, res);
  } catch (error: any | { message: string }) {
    logger.error(`Error in sign up route: ${error.message}`);
    res.status(500).json({ error: "Internal server error" });
  }
});

userRouter.post(
  "/sign-in",
  passport.authenticate("local", {
    session: false,
    failureRedirect: `${process.env.CLIENT_URL}/auth/login-in`,
  }),
  async (req: Request, res: Response) => {
    try {
      loginUser(req as Request & RequestWithUser, res);
    } catch (error: any | { message: string }) {
      logger.error(`Error in sign in route: ${error.message}`);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// NOTE: Protected routes
userRouter.post(
  "/log-out",
  verifyTokens,
  checkAuthState,
  async (req: Request, res: Response) => {
    try {
      logoutUser(req as Request & RequestWithUser, res);
    } catch (error: any | { message: string }) {
      logger.error(`Error in account delete route: ${error.message}`);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

userRouter.post(
  "/account-delete-request",
  verifyTokens,
  checkAuthState,
  async (req: Request, res: Response) => {
    try {
      sendDeleteAccountRequest(req as Request & RequestWithUser, res);
    } catch (error: any | { message: string }) {
      logger.error(`Error in account delete route: ${error.message}`);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

userRouter.delete(
  "/delete-account",
  verifyTokens,
  checkAuthState,
  async (req: Request, res: Response) => {
    try {
      deleteUserAccount(req as Request & RequestWithUser, res);
    } catch (error: any | { message: string }) {
      logger.error(`Error in account delete route: ${error.message}`);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

userRouter.get(
  "/profile",
  verifyTokens,
  checkAuthState,
  async (req: Request, res: Response) => {
    try {
      getUserProfile(req as Request & RequestWithUser, res);
    } catch (error: any | { message: string }) {
      logger.error(`Error in account delete route: ${error.message}`);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

userRouter.put(
  "/update-profile",
  verifyTokens,
  checkAuthState,
  async (req: Request, res: Response) => {
    try {
      updateUserProfile(req as Request & RequestWithUser, res);
    } catch (error: any | { message: string }) {
      logger.error(`Error in account delete route: ${error.message}`);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// NOTE: Open routes
userRouter.post("/verify-account-code", async (req: Request, res: Response) => {
  try {
    verifyUserAccountWithCode(req as Request & RequestWithUser, res);
  } catch (error: any | { message: string }) {
    logger.error(`Error in verify account with code route: ${error.message}`);
    res.status(500).json({ error: "Internal server error" });
  }
});

userRouter.post(
  "/verify-account-token/:token",
  async (req: Request, res: Response) => {
    try {
      verifyUserAccountWithToken(req as Request & RequestWithUser, res);
    } catch (error: any | { message: string }) {
      logger.error(
        `Error in verify account with token route: ${error.message}`
      );
      res.status(500).json({ error: "Internal server error" });
    }
  }
);
userRouter.post(
  "/resend-verification-code",
  async (req: Request, res: Response) => {
    try {
      resendVerificationCode(req as Request & RequestWithUser, res);
    } catch (error: any | { message: string }) {
      logger.error(
        `Error in resend verification email route: ${error.message}`
      );
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

userRouter.post(
  "/reset-password-request",
  async (req: Request, res: Response) => {
    try {
      requestPasswordReset(req, res);
    } catch (error: any | { message: string }) {
      logger.error(`Error in reset password request route: ${error.message}`);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

userRouter.put(
  "/reset-password/:token",
  async (req: Request, res: Response) => {
    try {
      resetPassword(req, res);
    } catch (error: any | { message: string }) {
      logger.error(`Error in reset password route: ${error.message}`);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

export default userRouter;
