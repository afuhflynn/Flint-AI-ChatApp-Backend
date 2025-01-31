var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import jwt from "jsonwebtoken";
import { config } from "dotenv";
// Load env vars
config();
const generateTokens = (id, email, username, userRole) => __awaiter(void 0, void 0, void 0, function* () {
    const privateAccessKey = process.env.ACCESS_TOKEN_SECRET;
    const privateRefreshKey = process.env.REFRESH_TOKEN_SECRET;
    if (!privateAccessKey) {
        throw new Error("ACCESS_TOKEN_SECRET is not defined in the environment variables.");
    }
    const accessToken = yield jwt.sign({ id: id, email: email, username: username, role: userRole }, privateAccessKey, { algorithm: "HS256", expiresIn: "1h" });
    const refreshToken = yield jwt.sign({ id: id, email: email, username: username, role: userRole }, privateRefreshKey, { algorithm: "HS256", expiresIn: "30d" });
    const accessTokenExpiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    const refreshTokenExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
    return {
        accessToken,
        accessTokenExpiresAt,
        refreshToken,
        refreshTokenExpiresAt,
    };
});
export default generateTokens;
//# sourceMappingURL=generateTokens.js.map