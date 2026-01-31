import mongoose from "mongoose";

const sellerProfileSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },

        farmName: {
            type: String,
            required: true,
        },

        farmType: {
            type: String,
            enum: ["fruitière", "légumière", "céréalière", "mixte", "élevage"],
        },

        certifications: [String],

        rating: {
            type: Number,
            default: 0,
        },

        totalSales: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

export default mongoose.model("SellerProfile", sellerProfileSchema);