import mongoose, { Schema, Document } from 'mongoose';

export interface IDocmnt extends Document {
    title: string;
    content: string;
    author: Schema.Types.ObjectId;
    co_authors: Schema.Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
    version: number;
}

const DocmntSchema: Schema = new Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: Object,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    co_authors: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    version: {
        type: Number,
        default: 1
    }
}, { timestamps: true });

export default mongoose.model<IDocmnt>('txts', DocmntSchema);