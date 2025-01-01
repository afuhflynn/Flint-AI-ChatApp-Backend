var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import genAIEndPoint from "../config/geminiModelSetup.js";
export const getGemini = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { prompt } = req.body;
    try {
        if (!prompt)
            return res.status(400).json({ message: "Prompt is required" });
        const { response, title } = yield genAIEndPoint(prompt);
        // const title: string = await genAITitleGenertorEndPoint(prompt);
        if (response === "An error occured. Please check your internet connection!") {
            return res.status(509).json({ message: response, title: title });
        }
        return res.status(200).json({ message: response, title: title });
    }
    catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
});
//# sourceMappingURL=gemini.controller.js.map