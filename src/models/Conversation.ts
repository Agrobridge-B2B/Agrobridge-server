import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IConversation extends Document {
    participants: Types.ObjectId[];
    lastMessage?: Types.ObjectId;
    isBlocked?: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const conversationSchema = new Schema<IConversation>(
    {
        participants: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User',
                required: true,
            },
        ],

        lastMessage: {
            type: Schema.Types.ObjectId,
            ref: 'Message',
        },

        isBlocked: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<IConversation>(
    'Conversation',
    conversationSchema
);