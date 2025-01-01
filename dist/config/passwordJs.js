var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import { config } from "dotenv";
// import User from "../models/user.model.js";
config();
const githubAuth = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        passport.use(new GitHubStrategy({
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: "http://127.0.0.1:3000/auth/github/callback",
        }, function (accessToken, refreshToken, profile, done) {
            console.log(profile);
            // User.findOrCreate({ githubId: profile.id }, function (err, user) {
            //   return done(err, user);
            // });
            return done(null, profile);
        }));
    }
    catch (error) { }
});
export default githubAuth;
//# sourceMappingURL=passwordJs.js.map