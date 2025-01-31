import { model, Schema } from "mongoose";
// Create the chats schema
const ChatsSchema = new Schema({
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
const Chat = model("chats", ChatsSchema);
export default Chat;
//# sourceMappingURL=chats.model.js.map