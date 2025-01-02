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
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Pre-save middleware to hash the password before saving
UserSchema.pre<UserSchemaTypes>("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

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
