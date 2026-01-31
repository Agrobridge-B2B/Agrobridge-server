import mongoose from "mongoose";

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