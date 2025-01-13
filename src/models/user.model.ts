import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import { UserSchemaTypes } from "../TYPES.js";
import { defaultAvatarUrl } from "../constants/constants.js";

const UserSchema: Schema<UserSchemaTypes> = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 50,
    },
    email: {
      type: String,
      unique: true,
      sparse: true, // Allows email to be optional for GitHub authentication
      trim: true,
      match: [
        /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/,
        "Please enter a valid email address.",
      ],
    },
    password: {
      type: String,
      minlength: 8,
      select: false, // Exclude password from query results by default
    },
    name: {
      firstName: {
        type: String,
        trim: true,
        minlength: 3,
        maxlength: 20,
      },
      lastName: {
        type: String,
        trim: true,
        minlength: 3,
        maxlength: 20,
      },
    },
    githubId: {
      type: String,
      unique: true,
      sparse: true, // Allows GitHub ID to be optional for Local authentication
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    hasTakenTour: {
      type: Boolean,
      default: false,
    },
    bio: {
      type: String,
      maxlength: 250,
      default: "",
    },
    preferences: {
      avatarUrl: {
        type: String,
        require: false,
        default: defaultAvatarUrl,
      },
      theme: {
        type: String,
        require: true,
        enum: ["light", "dark"],
        default: "light",
      },
    },
    chats: {
      type: Array,
      required: true,
      default: [
        {
          id: String,
          title: String,
          createdAt: Date,
          updatedAt: Date,
          chat: {
            type: Array,
            required: false,
            default: [
              {
                id: String,
                user: String,
                bot: String,
              },
            ],
          },
        },
      ],
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Method to compare passwords
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  if (!this.password) return false; // For GitHub users without passwords
  return await bcrypt.compare(candidatePassword, this.password);
};

// Create and export the User model
const User = mongoose.model<UserSchemaTypes>("user", UserSchema);

export default User;
