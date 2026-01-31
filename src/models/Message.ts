import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IMessage extends Document {
    conversation: Types.ObjectId;
    sender: Types.ObjectId;
    content?: string;
    images?: string[];
    isRead: boolean;
    createdAt: Date;
}

const messageSchema = new Schema<IMessage>(
    {
        conversation: {
            type: Schema.Types.ObjectId,
            ref: 'Conversation',
            required: true,
            index: true,
        },

        sender: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },

        content: {
            type: String,
            trim: true,
        },

        images: [
            {
                type: String,
            },
        ],

        isRead: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: { createdAt: true, updatedAt: false },
    }
);

export default mongoose.model<IMessage>('Message', messageSchema);