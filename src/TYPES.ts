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
  name?: {
    firstName: string;
    lastName: string;
  };
  resetPasswordToken?: string;
  resetPasswordTokenExpires?: Date;
  verificationCode?: string;
  verificationCodeExpires?: Date;
  verificationToken?: string;
  verificationTokenExpires?: Date;
  accessToken?: string;
  accessTokenExpires?: Date;
  refreshToken?: string;
  refreshTokenExpires?: Date;
  accountDeleteToken?: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
  chats?: {
    id: string;
    title: string | any;
    createdAt: Date;
    updatedAt?: Date;
    chat: {
      id: string;
      user: string;
      bot: string | any;
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

export interface GitHubProfileTypes {
  id: string; // GitHub user ID
  nodeId: string;
  username: string; // GitHub username
  displayName: string; // User's full name (if available)
  profileUrl: string;
  emails: { value: string; verified: boolean }[]; // Array of email objects
  photos?: { value: string }[]; // Array of photo objects containing the avatar URL
  provider: string; // Always "github" for this strategy
  _json: {
    login: string; // GitHub username
    id: number; // GitHub numeric ID
    node_id: string;
    avatar_url: string; // Avatar URL
    gravatar_url: string;
    url: string;
    html_url: string; // Profile URL on GitHub
    name?: string; // User's full name
    email: string; // User's public email
    bio?: string; // User bio
    public_repos: number; // Number of public repositories
    followers: number; // Number of followers
    following: number; // Number of following
    [key: string]: any; // Additional properties from GitHub API
  };
}
