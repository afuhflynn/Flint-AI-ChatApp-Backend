var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { genAIEndPoint, genAITitleEndPoint, } from "../config/geminiModelSetup.js";
import crypto from "node:crypto";
import User from "../models/user.model.js";
import Chat from "../models/chats.model.js";
import logger from "../utils/loger.js";
// General Variable to store ai response to ensure proper realtime response on the frontend
let AI_RESPONSE = "";
// NOTE: Delete old chats after 100 days
// Handle user chats
// NOTE: Protected handlers
// Saves a new prompt to an existing conversation or creates a new one
export const handleUserChats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { chatID, prompt } = req.body;
    if (!prompt)
        return res.status(400).json({ message: "A Prompt must be provided" });
    try {
        // Check if chat is new and modify user db chat db
        const foundChats = yield Chat.findOne({
            userID: req.user._id,
            userName: req.user.username,
        });
        const foundUser = yield User.findOne({ _id: req.user._id });
        if (foundUser && foundChats) {
            const currentConversation = foundChats.chats.find((conversation) => conversation.id === chatID);
            // if there is no current ongoing chat or conversation create one
            if (!currentConversation) {
                const newConversationID = yield crypto.randomBytes(60).toString("hex"); // new Conversation id for each prompt
                // Check if chat already exist
                const newTitle = yield genAITitleEndPoint(prompt);
                const newConversation = {
                    id: newConversationID,
                    title: newTitle,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    conversations: [
                        {
                            role: "user",
                            parts: [
                                {
                                    text: prompt,
                                    image: "",
                                },
                            ],
                        },
                    ],
                };
                // Save to chats collection
                foundChats.chats.push(newConversation);
                yield foundChats.save();
                // Save to user collection
                foundUser.chats.push({
                    id: newConversation.id,
                    title: newConversation.title,
                    createdAt: newConversation.createdAt,
                    updatedAt: newConversation.createdAt,
                });
                yield foundUser.save();
            }
            else {
                yield Chat.updateOne({ "chats.userName": req.user._id, "chats.chatID": chatID }, {
                    chats: {
                        $push: {
                            conversations: {
                                role: "user",
                                parts: [
                                    {
                                        text: prompt,
                                        image: "",
                                    },
                                ],
                            },
                        },
                    },
                });
            }
        }
        else {
            // Create a new user chats collection
            const newConversationID = yield crypto.randomBytes(60).toString("hex"); // new Conversation id for each prompt
            // Check if chat already exist
            const newTitle = yield genAITitleEndPoint(prompt);
            const newChats = new Chat({
                userID: req.user._id,
                userName: req.user.username,
                conversations: [
                    {
                        id: newConversationID,
                        title: newTitle,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        conversations: [
                            {
                                role: "user",
                                parts: [
                                    {
                                        text: prompt,
                                        image: "",
                                    },
                                ],
                            },
                        ],
                    },
                ],
            });
            yield newChats.save();
        }
    }
    catch (error) {
        logger.error(`Error saving user chat: ${error.message}`);
        return res.status(500).json({ message: "Internal server error" });
    }
});
// Handle gemini chats
//  Gets the gemini response in real time
export const handleGeminiChats = (req, res, prompt) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check if chat is new and modify user db chat db
        const foundChats = yield Chat.findOne({
            userID: req.user._id,
            userName: req.user.username,
        });
        if (foundChats) {
            const newAIResponse = yield genAIEndPoint(prompt);
            AI_RESPONSE = newAIResponse;
            return res.status(200).json({ message: AI_RESPONSE });
        }
        else {
            return res.status(400).json({ message: "An error occurred" });
        }
    }
    catch (error) {
        logger.error(`Error getting gemini response: ${error.message}`);
        return res.status(500).json({ message: "Internal server error" });
    }
});
// Handle save gemini chats
// Saves the completed gemini response to an existing conversation
export const handleSaveGeminiChats = (req, res, chatID) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check if chat is new and modify user db chat db
        const foundChats = yield Chat.findOne({
            userID: req.user._id,
            userName: req.user.username,
        });
        if (!foundChats)
            return res.status(400).json({ message: "An error occurred" });
        const currentConversation = foundChats.chats.find((conversation) => conversation.id === chatID);
        if (!currentConversation)
            return res.status(400).json({ message: "An error occurred" });
        currentConversation.conversations.push({
            role: "model",
            parts: [
                {
                    text: AI_RESPONSE,
                    image: "",
                },
            ],
        });
        // Replace current conversation in db with the updated one
        foundChats.chats.map((conversation) => {
            if (conversation.id === chatID) {
                conversation = currentConversation;
            }
        });
        yield foundChats.save();
        return res.status(200).json({ message: "Response saved successfully!" });
    }
    catch (error) {
        logger.error(`Error saving gemini response to db: ${error.message}`);
        return res.status(500).json({ message: "Internal server error" });
    }
});
// NOTE: Unprotected handlers
// Simply gets a response with no complicated work done
export const handleGeminiResponse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { prompt } = req.body;
        if (!prompt)
            return res.status(400).json({ message: "A prompt is expected" });
        const newAIResponse = yield genAIEndPoint(prompt);
        return res.status(200).json({ message: newAIResponse });
    }
    catch (error) {
        logger.error(`Error generating gemini response: ${error.message}`);
        return res.status(500).json({ message: "Internal server error" });
    }
});
//# sourceMappingURL=gemini.controller.js.map