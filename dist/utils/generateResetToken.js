var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import crypto from "node:crypto";
const generateResetToken = () => __awaiter(void 0, void 0, void 0, function* () {
    const resetToken = yield crypto.randomBytes(60).toString("hex");
    const expiresAt = Date.now() + 1 * 60 * 60 * 1000;
    return { resetToken, expiresAt };
});
export default generateResetToken;
//# sourceMappingURL=generateResetToken.js.map