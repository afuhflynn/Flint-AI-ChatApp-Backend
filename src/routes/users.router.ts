import express, { Router, Request, Response, NextFunction } from "express";
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
    await registerUser(req, res);
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

userRouter.post(
  "/log-out",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await verifyTokens(req as Request & RequestWithUser, res, next);
      await checkAuthState(req as Request & RequestWithUser, res, next);
      await logoutUser(req as Request & RequestWithUser, res);
    } catch (error: any | { message: string }) {
      logger.error(`Error in log out route: ${error.message}`);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

userRouter.post(
  "/account-delete-request",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await verifyTokens(req as Request & RequestWithUser, res, next);
      await checkAuthState(req as Request & RequestWithUser, res, next);
      await sendDeleteAccountRequest(req as Request & RequestWithUser, res);
    } catch (error: any | { message: string }) {
      logger.error(`Error in account delete request route: ${error.message}`);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

userRouter.delete(
  "/delete-account",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await verifyTokens(req as Request & RequestWithUser, res, next);
      await checkAuthState(req as Request & RequestWithUser, res, next);
      await deleteUserAccount(req as Request & RequestWithUser, res);
    } catch (error: any | { message: string }) {
      logger.error(`Error in account delete route: ${error.message}`);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

userRouter.get(
  "/profile",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await verifyTokens(req as Request & RequestWithUser, res, next);
      await checkAuthState(req as Request & RequestWithUser, res, next);
      await getUserProfile(req as Request & RequestWithUser, res);
    } catch (error: any | { message: string }) {
      logger.error(`Error in get user profile route: ${error.message}`);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

userRouter.put(
  "/update-profile",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await verifyTokens(req as Request & RequestWithUser, res, next);
      await checkAuthState(req as Request & RequestWithUser, res, next);
      await updateUserProfile(req as Request & RequestWithUser, res);
    } catch (error: any | { message: string }) {
      logger.error(`Error in update user profile route: ${error.message}`);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

userRouter.post("/verify-account-code", async (req: Request, res: Response) => {
  try {
    await verifyUserAccountWithCode(req as Request & RequestWithUser, res);
  } catch (error: any | { message: string }) {
    logger.error(`Error in verify account with code route: ${error.message}`);
    res.status(500).json({ error: "Internal server error" });
  }
});

userRouter.post(
  "/verify-account-token/:token",
  async (req: Request, res: Response) => {
    try {
      await verifyUserAccountWithToken(req as Request & RequestWithUser, res);
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
      await resendVerificationCode(req as Request & RequestWithUser, res);
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
      await requestPasswordReset(req, res);
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
      await resetPassword(req, res);
    } catch (error: any | { message: string }) {
      logger.error(`Error in reset password route: ${error.message}`);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

export default userRouter;
