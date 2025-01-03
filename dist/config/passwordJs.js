var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Strategy as GitHubStrategy } from "passport-github2";
import { Strategy as localStrategy } from "passport-local";
import { config } from "dotenv";
import User from "../models/user.model.js";
config();
// Verify call back functions
const localVerifyCallback = (user, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!user || !password)
            return done(null, false);
        const foundUser = yield User.findOne({
            $or: [{ username: user }, { email: user }],
        });
        if (!foundUser)
            return done(null, false);
        const userMatch = yield foundUser.comparePassword(password);
        if (!userMatch)
            return done(null, false);
        return done(null, foundUser);
    }
    catch (error) {
        return done(error);
    }
});
// Strategy init
const LocalStrategy = new localStrategy(localVerifyCallback);
const gitHubStrategy = new GitHubStrategy();
//# sourceMappingURL=passwordJs.js.map