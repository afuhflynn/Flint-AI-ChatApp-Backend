var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { defaultAvatarUrl } from "../constants/constants.js";
const UserSchema = new mongoose.Schema({
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
}, {
    timestamps: true, // Automatically add createdAt and updatedAt fields
});
// Method to compare passwords
UserSchema.methods.comparePassword = function (candidatePassword) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.password)
            return false; // For GitHub users without passwords
        return yield bcrypt.compare(candidatePassword, this.password);
    });
};
// Create and export the User model
const User = mongoose.model("user", UserSchema);
export default User;
//# sourceMappingURL=user.model.js.map