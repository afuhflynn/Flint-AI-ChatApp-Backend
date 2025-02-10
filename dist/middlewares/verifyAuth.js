var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import User from "../models/user.model.js";
import logger from "../utils/loger.js";
// Check auth state
export const checkAuthState = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const checkAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const user = yield User.findOne({
                _id: req.user.id,
                username: req.user.username,
                email: req.user.email,
                role: req.user.role,
                isVerified: true,
            });
            if (!user)
                return res.status(401).json({
                    success: false,
                    message: "Please confirm your email and login to your account",
                });
            // First empty the req user object
            req.user = {};
            req.user.id = user._id;
            req.user.username = user.username;
            req.user.email = user.email;
            req.user.role = user.role;
            return next();
        }
        catch (error) {
            logger.error(`Error Checking user auth state: ${error.message}`);
            return res
                .status(500)
                .json({ message: "Internal server error. Please try again later" });
        }
    });
    checkAuth(req, res, next);
});
//# sourceMappingURL=verifyAuth.js.map