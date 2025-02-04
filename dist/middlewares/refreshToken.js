import logger from "../utils/loger.js";
import { refreshHandler } from "../controllers/users.controller.js";
export const refreshTokens = (req, res) => {
    try {
        refreshHandler(req, res);
    }
    catch (error) {
        logger.error(`Error in refresh token route: ${error.message}`);
        res.status(500).json({ error: "Internal server error" });
    }
};
//# sourceMappingURL=refreshToken.js.map