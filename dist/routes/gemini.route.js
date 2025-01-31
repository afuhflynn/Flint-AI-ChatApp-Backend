var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Router } from "express";
import { handleGeminiChats, handleUserChats, handleSaveGeminiChats, } from "../controllers/gemini.controller.js";
const geminiRouter = Router();
geminiRouter.post("/api/ai", (req, res) => {
    const handleChats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield handleUserChats(req, res);
            yield handleGeminiChats(req, res, req.body.prompt);
            yield handleSaveGeminiChats(req, res, req.body.chatID);
        }
        catch (error) {
            console.error("Error in gemini route:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    });
    handleChats(req, res);
});
export default geminiRouter;
//# sourceMappingURL=gemini.route.js.map