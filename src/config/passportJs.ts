import express from "express";
// Import required modules
import passport, { DoneCallback } from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import { Strategy as LocalStrategy } from "passport-local";
import { config } from "dotenv";
// import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import generateTokens from "../utils/generateTokens.js";
import { UserSchemaTypes, VerifyFunction } from "../TYPES.js";

config();

declare module "express-session" {
  interface SessionData {
    visited?: boolean;
    userId: "";
    user: UserSchemaTypes | null;
  }
}

// Verify callback for Local Strategy
const localVerifyCallback: VerifyFunction = async (
  username,
  password,
  done
): Promise<void> => {
  try {
    if (!username || !password)
      return done(null, false, { message: "All fields are required" });

    const foundUser = await User.findOne({
      $or: [{ username: username }, { email: username }],
    }).select("+password");

    if (!foundUser)
      return done(null, false, { message: "Invalid credentials" });

    const isMatch = await foundUser.comparePassword(password);
    if (!isMatch) return done(null, false, { message: "Invalid credentials" });

    foundUser.isVerified = true;
    const {
      accessToken,
      refreshToken,
      accessTokenExpiresAt,
      refreshTokenExpiresAt,
    } = await generateTokens(
      foundUser.email,
      username,
      foundUser._id,
      foundUser.role
    );
    foundUser.accessToken = accessToken;
    foundUser.refreshToken = refreshToken;
    foundUser.accessTokenExpires = accessTokenExpiresAt;
    foundUser.refreshTokenExpires = refreshTokenExpiresAt;
    await foundUser.save();
    express.request.session.user = foundUser;
    return done(null, foundUser, { message: "Logged in successfully" });
  } catch (error) {
    return done(error, false, { message: "An error occurred" });
  }
};

// Verify callback for GitHub Strategy
const gitHubVerifyCallback = async (
  accessToken: string,
  refreshToken: string,
  profile: any,
  done: DoneCallback
): Promise<void> => {
  try {
    const existingUser = await User.findOne({ githubId: profile.id });

    if (existingUser) {
      return done(null, existingUser);
    }

    const newUser = new User({
      githubId: profile.id,
      username: profile.username,
      email: profile.emails[0]?.value,
      preferences: {
        avatarUrl: profile.avatar_url,
        theme: "light",
      },
      accessToken,
      refreshToken,
      accesstokenExpires: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
      refreshTokenExpires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      isVerified: true,
    });

    await newUser.save();
    return done(null, newUser);
  } catch (error) {
    return done(error, false);
  }
};

// Initialize Local Strategy
passport.use(
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
      passReqToCallback: false,
    },
    localVerifyCallback
  )
);

// Initialize GitHub Strategy
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      callbackURL: process.env.GITHUB_CALLBACK_URL!,
    },
    gitHubVerifyCallback
  )
);

// Serialize and Deserialize User
passport.serializeUser((user, done) => {
  done(null, (user as any)._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    if (!user) return done(null, false);
    return done(null, user);
  } catch (error) {
    done(error, null);
  }
});
