import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        buyer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        seller: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },

        quantity: {
            type: Number,
            required: true,
        },

        totalPrice: {
            type: Number,
            required: true,
        },

        status: {
            type: String,
            enum: ["pending", "confirmed", "shipped", "delivered", "completed"],
            default: "pending",
        },

        paymentIntentId: String,
    },
    { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
