import logger from "../utils/loger.js";
import { refreshHandler } from "../controllers/users.controller.js";
export const refreshTokens = (req, res, next) => {
    try {
        refreshHandler(req, res, next);
    }
    catch (error) {
        logger.error(`Error in refresh token route: ${error.message}`);
        res.status(500).json({ error: "Internal server error" });
    }
};
//# sourceMappingURL=refreshToken.js.map