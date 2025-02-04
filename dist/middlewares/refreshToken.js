var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import logger from "../utils/loger.js";
import { refreshHandler } from "../controllers/users.controller.js";
export const refreshTokens = (req, res, next) => {
    const refresh = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            refreshHandler(req, res, next);
        }
        catch (error) {
            logger.error(`Error in refresh token route: ${error.message}`);
            res.status(500).json({ error: "Internal server error" });
        }
    });
    refresh(req, res, next);
};
//# sourceMappingURL=refreshToken.js.map