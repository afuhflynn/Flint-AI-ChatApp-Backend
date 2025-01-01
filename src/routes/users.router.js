import { Router, Request, Response } from "express";
import {
  deleteUser,
  forgotPassword,
  logInUser,
  logOutUser,
  resetPassword,
  signUpUser,
} from "../controllers/users.controller.js";
import verifyTokens from "../middlewares/verifyTokens.js";

const userRouter = Router();

userRouter.post("/sign-up", async (req: Request, res: Response) => {
  try {
    await signUpUser(req, res);
  } catch (error) {
    console.error("Error in sign-up route:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
userRouter.post("/sign-in", async (req: Request, res: Response) => {
  try {
    await logInUser(req, res);
  } catch (error) {
    console.error("Error in sign-up route:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
userRouter.put("/verify-account", async (req: Request, res: Response) => {
  try {
    await verifyUser(req, res);
  } catch (error) {
    console.error("Error in sign-up route:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
userRouter.post("/log-out", async (req: Request, res: Response) => {
  try {
    await logOutUser(req, res);
  } catch (error) {
    console.error("Error in sign-up route:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
userRouter.patch("/forgot-password", async (req: Request, res: Response) => {
  try {
    await forgotPassword(req, res);
  } catch (error) {
    console.error("Error in sign-up route:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
userRouter.put(
  "/reset-password/:token",
  async (req: Request, res: Response) => {
    try {
      await resetPassword(req, res);
    } catch (error) {
      console.error("Error in sign-up route:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);
userRouter.delete(
  "/delete-account",
  verifyTokens,
  async (req: Request, res: Response) => {
    try {
      await deleteUser(req, res);
    } catch (error) {
      console.error("Error in sign-up route:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

export default userRouter;
