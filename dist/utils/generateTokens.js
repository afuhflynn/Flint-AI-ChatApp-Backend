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
const generateTokens = (res, email, username, id, userRole) => __awaiter(void 0, void 0, void 0, function* () {
    const privateAccessKey = process.env.ACCESS_TOKEN_SECRET;
    if (!privateAccessKey) {
        throw new Error("ACCESS_TOKEN_SECRET is not defined in the environment variables.");
    }
    const accessToken = jwt.sign({ email: email, username: username, id: id, userRole: userRole }, privateAccessKey, { algorithm: "HS256", expiresIn: "30d" });
    const dateNow = Date.now() + 720 * 60 * 60 * 1000;
    const expiresAt = new Date(dateNow);
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.APP_STATUS === "production" && true,
        sameSite: "strict",
        maxAge: dateNow,
    });
    return { accessToken, expiresAt };
});
export default generateTokens;
//# sourceMappingURL=generateTokens.js.map