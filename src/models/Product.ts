import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        seller: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        name: {
            type: String,
            required: true,
            index: true,
        },

        description: String,

        category: {
            type: String,
            required: true,
            index: true,
        },

        country: {
            type: String,
            required: true,
            index: true,
        },

        pricePerUnit: {
            type: Number,
            required: true,
        },

        unit: {
            type: String,
            enum: ["KG", "QUINTAL", "TONNE"],
            required: true,
        },

        minOrderQuantity: {
            type: Number,
            default: 1,
        },

        images: [String],

        certifications: [String],

        isApproved: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

export default mongoose.model("Product", productSchema);