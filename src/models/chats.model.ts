import { model, Schema } from "mongoose";
import { ChatSchemaTypes } from "../TYPES.js";

// Create the chats schema
const ChatsSchema: Schema<ChatSchemaTypes> = new Schema({
  userID: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  chats: [
    {
      id: String,
      title: String,
      createdAt: Date,
      updatedAt: Date,
      conversations: [
        {
          role: {
            type: String,
            enum: ["user", "model"],
          },
          parts: [
            {
              text: String,
              image: String,
            },
          ],
        },
      ],
    },
  ],
});

// Chats model
const Chat = model<ChatSchemaTypes>("chats", ChatsSchema);

export default Chat;
