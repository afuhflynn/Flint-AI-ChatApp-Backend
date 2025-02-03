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
import User from "../models/user.model.js";
import generateTokens from "../utils/generateTokens.js";
import logger from "../utils/loger.js";
config();
// Verify callback for Local Strategy (Email/Password Login)
const localVerifyCallback = (username, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!username || !password)
            return done(null, false, { message: "All fields are required" });
        const foundUser = yield User.findOne({
            $or: [{ username }, { email: username }],
        }).select("+password");
        if (!foundUser || !(yield foundUser.comparePassword(password)))
            return done(null, false, { message: "Invalid credentials" });
        foundUser.isVerified = true;
        const { accessToken, refreshToken, accessTokenExpiresAt, refreshTokenExpiresAt, } = yield generateTokens(foundUser._id, foundUser.email, username, foundUser.role);
        foundUser.accessToken = accessToken;
        foundUser.refreshToken = refreshToken;
        foundUser.accessTokenExpires = accessTokenExpiresAt;
        foundUser.refreshTokenExpires = refreshTokenExpiresAt;
        yield foundUser.save();
        return done(null, foundUser);
    }
    catch (error) {
        logger.error(`Error login in user: ${error.message}`);
        return done(error, false);
    }
});
/// GitHub OAuth callback
const gitHubVerifyCallback = (accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    console.log(accessToken, refreshToken); // Just logging to console since I won't make use of this data
    try {
        let user = yield User.findOne({
            githubId: profile.id,
        });
        if (!user) {
            // Check if username and email already exists
            const foundUser = yield User.findOne({
                $or: [
                    { username: profile.username },
                    { email: (_b = (_a = profile === null || profile === void 0 ? void 0 : profile.emails) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.value },
                ],
            });
            if (!foundUser) {
                const newUser = new User({
                    githubId: profile.id,
                    username: profile.username,
                    email: (_d = (_c = profile === null || profile === void 0 ? void 0 : profile.emails) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.value,
                    preferences: { avatarUrl: profile._json.avatar_url, theme: "light" },
                    bio: profile._json.bio,
                    isVerified: true,
                });
                user = yield newUser.save();
            }
            else {
                return done("User name or email already exists!");
            }
        }
        return done(null, user);
    }
    catch (error) {
        logger.error(`Error login in user with github: ${error.message}`);
        return done(error, false);
    }
});
// Register Strategies
passport.use(new LocalStrategy({ usernameField: "username", passwordField: "password" }, localVerifyCallback));
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL,
}, gitHubVerifyCallback));
export default passport;
//# sourceMappingURL=passportJs.js.map