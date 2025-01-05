import { NextFunction, Request, Response } from "express";
import { UserSchemaTypes } from "../TYPES.js";

declare module "express-session" {
  interface SessionData {
    visited?: boolean;
    user: UserSchemaTypes | null;
  }
}

// middlewares/session.js
export const updateUserSession = (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  if (req.user && "username" in req.user && "email" in req.user) {
    req.session.user = req.user as UserSchemaTypes;

    req.session.visited = true;
    req.session.save((err) => {
      if (err) return next(err);
      next();
    });
  } else {
    next();
  }
};
