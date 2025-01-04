import { Document } from "mongoose";
import express from "express";
// Interface for User Document
export interface UserSchemaTypes extends Document {
  username: string;
  email: string;
  password: string;
  githubId?: string;
  role: "user" | "admin";
  isVerified: boolean;
  bio: string;
  resetPasswordToken?: string;
  resetPasswordTokenExpires?: Date;
  verificationCode?: string;
  verificationCodeExpires?: Date;
  accessToken?: string;
  accessTokenExpires?: Date;
  refreshToken?: string;
  refreshTokenExpires?: Date;
  accountDeleteToken?: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
  chats?: {
    id: string;
    title: string;
    conversations: {
      chatsession: {
        id: string;
        user: string;
        bot: string;
      };
    }[];
  }[];
  preferences?: {
    avatarUrl: string;
    theme: "light" | "dark";
  };
}

export interface IStrategyOptions {
  usernameField?: string | undefined;
  passwordField?: string | undefined;
  session?: boolean | undefined;
  passReqToCallback?: false | undefined;
}

export interface IStrategyOptionsWithRequest {
  usernameField?: string | undefined;
  passwordField?: string | undefined;
  session?: boolean | undefined;
  passReqToCallback: true;
}

export interface IVerifyOptions {
  message: string;
}

export interface VerifyFunctionWithRequest {
  (
    req: express.Request,
    username: string,
    password: string,
    done: (
      error: any,
      user?: Express.User | false,
      options?: IVerifyOptions
    ) => void
  ): void;
}

export interface VerifyFunction {
  (
    username: string,
    password: string,
    done: (
      error: any,
      user?: Express.User | false,
      options?: IVerifyOptions
    ) => void
  ): void;
}
