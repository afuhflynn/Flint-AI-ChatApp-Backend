var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Import required modules
import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import { Strategy as LocalStrategy } from "passport-local";
import { config } from "dotenv";
// import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import generateTokens from "../utils/generateTokens.js";
config();
// Verify callback for Local Strategy
const localVerifyCallback = (username, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!username || !password)
            return done(null, false, { message: "All fields are required" });
        const foundUser = yield User.findOne({
            $or: [{ username: username }, { email: username }],
        }).select("+password");
        if (!foundUser)
            return done(null, false, { message: "Invalid credentials" });
        const isMatch = yield foundUser.comparePassword(password);
        if (!isMatch)
            return done(null, false, { message: "Invalid credentials" });
        foundUser.isVerified = true;
        const { accessToken, refreshToken, accessTokenExpiresAt, refreshTokenExpiresAt, } = yield generateTokens(foundUser.email, username, foundUser._id, foundUser.role);
        foundUser.accessToken = accessToken;
        foundUser.refreshToken = refreshToken;
        foundUser.accessTokenExpires = accessTokenExpiresAt;
        foundUser.refreshTokenExpires = refreshTokenExpiresAt;
        yield foundUser.save();
        return done(null, foundUser, { message: "Logged in successfully" });
    }
    catch (error) {
        return done(error, false, { message: "An error occurred" });
    }
});
// Verify callback for GitHub Strategy
const gitHubVerifyCallback = (accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        console.log(profile);
        const existingUser = yield User.findOne({ githubId: profile.id });
        if (existingUser)
            return done(null, existingUser);
        const newUser = new User({
            githubId: profile.id,
            username: profile.username,
            email: (_a = profile === null || profile === void 0 ? void 0 : profile.emails[0]) === null || _a === void 0 ? void 0 : _a.value,
            preferences: {
                avatarUrl: profile === null || profile === void 0 ? void 0 : profile.avatar_url,
                theme: "light",
            },
            bio: profile === null || profile === void 0 ? void 0 : profile.bio,
            accessToken,
            refreshToken,
            accesstokenExpires: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
            refreshTokenExpires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
            isVerified: true,
        });
        yield newUser.save();
        //send welcome email
        return done(null, newUser);
    }
    catch (error) {
        return done(error, false);
    }
});
// Initialize Local Strategy
passport.use(new LocalStrategy({
    usernameField: "username",
    passwordField: "password",
    passReqToCallback: false,
}, localVerifyCallback));
// Initialize GitHub Strategy
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL,
}, gitHubVerifyCallback));
// Serialize and Deserialize User
passport.serializeUser((user, done) => {
    done(null, user._id);
});
passport.deserializeUser((id, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User.findById(id);
        if (!user)
            return done(null, false);
        return done(null, user);
    }
    catch (error) {
        done(error, null);
    }
}));
//# sourceMappingURL=passportJs.js.map