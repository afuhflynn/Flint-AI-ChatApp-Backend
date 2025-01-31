import { Request, Response } from "express";
import {
  genAIEndPoint,
  genAITitleEndPoint,
} from "../config/geminiModelSetup.js";
import crypto from "node:crypto";
import User from "../models/user.model.js";
import Chat from "../models/chats.model.js";
import { RequestWithUser } from "../TYPES.js";

// General Variable to store ai response to ensure proper realtime response on the frontend
let AI_RESPONSE: string = "";

// NOTE: Delete old chats after 100 days

// Handle user chats
export const handleUserChats = async (
  req: Request & RequestWithUser,
  res: Response
) => {
  const { chatID, prompt } = req.body;
  if (!prompt)
    return res.status(400).json({ message: "A Prompt must be provided" });
  try {
    // Check if chat is new and modify user db chat db
    const foundChats = await Chat.findOne({
      userID: req.user._id,
      userName: req.user.username,
    });
    const foundUser = await User.findOne({ _id: req.user._id });

    if (foundUser && foundChats) {
      const currentConversation = foundChats.chats.find(
        (conversation) => conversation.id === chatID
      );

      // if there is no current ongoing chat or conversation create one
      if (!currentConversation) {
        const newConversationID = await crypto.randomBytes(60).toString("hex"); // new Conversation id for each prompt
        // Check if chat already exist
        const newTitle = await genAITitleEndPoint(prompt);
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
        await foundChats.save();
        // Save to user collection
        foundUser.chats.push({
          id: newConversation.id,
          title: newConversation.title,
          createdAt: newConversation.createdAt,
          updatedAt: newConversation.createdAt,
        });
        await foundUser.save();
      } else {
        await Chat.updateOne(
          { "chats.userName": req.user._id, "chats.chatID": chatID },
          {
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
          }
        );
      }
    } else {
      // Create a new user chats collection
      const newConversationID = await crypto.randomBytes(60).toString("hex"); // new Conversation id for each prompt
      // Check if chat already exist
      const newTitle = await genAITitleEndPoint(prompt);
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

      await newChats.save();
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Handle gemini chats
export const handleGeminiChats = async (
  req: Request & RequestWithUser,
  res: Response,
  prompt: string
) => {
  try {
    // Check if chat is new and modify user db chat db
    const foundChats = await Chat.findOne({
      userID: req.user._id,
      userName: req.user.username,
    });

    if (foundChats) {
      const newAIResponse = await genAIEndPoint(prompt);
      AI_RESPONSE = newAIResponse;
    } else {
      return res.status(400).json({ message: "An error occured" });
    }
    return res.status(200).json({ message: AI_RESPONSE });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Handle save gemini chats
export const handleSaveGeminiChats = async (
  req: Request & RequestWithUser,
  res: Response,
  chatID: string
) => {
  try {
    // Check if chat is new and modify user db chat db
    const foundChats = await Chat.findOne({
      userID: req.user._id,
      userName: req.user.username,
    });

    if (!foundChats)
      return res.status(400).json({ message: "An error occured" });
    const currentConversation = foundChats.chats.find(
      (conversation) => conversation.id === chatID
    );
    if (!currentConversation)
      return res.status(400).json({ message: "An error occured" });

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
    await foundChats.save();
    return res.status(200).json({ message: "Response saved successfully!" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
