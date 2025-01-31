// Import required modules
import passport, { DoneCallback } from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { config } from "dotenv";
import User from "../models/user.model.js";
import generateTokens from "../utils/generateTokens.js";
import { GitHubProfileTypes, VerifyFunction } from "../TYPES.js";

config();

// Verify callback for Local Strategy (Email/Password Login)
const localVerifyCallback: VerifyFunction = async (
  username,
  password,
  done
) => {
  try {
    if (!username || !password)
      return done(null, false, { message: "All fields are required" });

    const foundUser = await User.findOne({
      $or: [{ username }, { email: username }],
    }).select("+password");
    if (!foundUser || !(await foundUser.comparePassword(password)))
      return done(null, false, { message: "Invalid credentials" });

    foundUser.isVerified = true;
    const {
      accessToken,
      refreshToken,
      accessTokenExpiresAt,
      refreshTokenExpiresAt,
    } = await generateTokens(
      foundUser._id,
      foundUser.email,
      username,
      foundUser.role
    );

    foundUser.accessToken = accessToken;
    foundUser.refreshToken = refreshToken;
    foundUser.accessTokenExpires = accessTokenExpiresAt;
    foundUser.refreshTokenExpires = refreshTokenExpiresAt;
    await foundUser.save();

    return done(null, { user: foundUser, accessToken, refreshToken });
  } catch (error) {
    return done(error, false, { message: "An error occurred" });
  }
};

// Verify callback for GitHub Strategy (OAuth)
const gitHubVerifyCallback = async (
  accessToken: string,
  refreshToken: string,
  profile: GitHubProfileTypes,
  done: DoneCallback
) => {
  try {
    let user = await User.findOne({ githubId: profile.id });

    if (!user) {
      user = new User({
        githubId: profile.id,
        username: profile.username,
        email: profile?.emails?.[0]?.value,
        preferences: { avatarUrl: profile._json.avatar_url, theme: "light" },
        bio: profile._json.bio,
        accessToken,
        refreshToken,
        accesstokenExpires: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
        refreshTokenExpires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        isVerified: true,
      });

      await user.save();
    }

    return done(null, { user, accessToken, refreshToken });
  } catch (error) {
    return done(error, false);
  }
};

// JWT Strategy for Stateless Authentication
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.ACCESS_TOKEN_SECRET!,
};

const jwtVerifyCallback = async (
  jwt_payload: {
    id: string | unknown;
    email: string;
    username: string;
    role: string;
  },
  done: DoneCallback
) => {
  try {
    const user = await User.findById(jwt_payload.id);
    if (user) return done(null, user);
    return done(null, false);
  } catch (error) {
    return done(error, false);
  }
};

// Register Strategies
passport.use(
  new LocalStrategy(
    { usernameField: "username", passwordField: "password" },
    localVerifyCallback
  )
);
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
passport.use(new JwtStrategy(jwtOptions, jwtVerifyCallback));

export default passport;
