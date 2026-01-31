import mongoose from "mongoose";

export type UserRole = "buyer" | "seller" | "admin";

export interface IUser extends Document {
    role: UserRole;
    fullName: string;
    email: string;
    password: string;
    country: string;
    isVerified: boolean;
    isBlocked: boolean;
}

const userSchema = new mongoose.Schema(
    {
        role: {
            type: String,
            enum: ["buyer", "seller", "admin"],
            required: true,
        },

        fullName: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },

        password: {
            type: String,
            required: true,
            minlength: 6,
            select: false,
        },

        country: {
            type: String,
            required: true,
        },

        isVerified: {
            type: Boolean,
            default: false,
        },

        isBlocked: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

export default mongoose.model("User", userSchema);