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
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { config } from "dotenv";
import User from "../models/user.model.js";
import generateTokens from "../utils/generateTokens.js";
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
        return done(null, { user: foundUser, accessToken, refreshToken });
    }
    catch (error) {
        return done(error, false, { message: "An error occurred" });
    }
});
/// GitHub OAuth callback
const gitHubVerifyCallback = (accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        let user = yield User.findOne({ githubId: profile.id });
        console.log(accessToken, refreshToken);
        if (!user) {
            const newUser = new User({
                githubId: profile.id,
                username: profile.username,
                email: (_b = (_a = profile === null || profile === void 0 ? void 0 : profile.emails) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.value,
                preferences: { avatarUrl: profile._json.avatar_url, theme: "light" },
                bio: profile._json.bio,
                isVerified: true,
            });
            user = yield newUser.save();
        }
        return done(null, user);
    }
    catch (error) {
        return done(error, false);
    }
});
// JWT Strategy for Stateless Authentication
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.ACCESS_TOKEN_SECRET,
};
const jwtVerifyCallback = (jwt_payload, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User.findById(jwt_payload.id);
        if (user)
            return done(null, user);
        return done(null, false);
    }
    catch (error) {
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
passport.use(new JwtStrategy(jwtOptions, jwtVerifyCallback));
export default passport;
//# sourceMappingURL=passportJs.js.map