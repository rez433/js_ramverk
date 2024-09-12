import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    name: string;
    email: string;
    role: 'author' | 'co_author';
    documents: Schema.Types.ObjectId[];
}

const UserSchema: Schema = new Schema({
    name: {
        type: String,
        required: true },
    email: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        enum: ['author', 'co_author'],
        default: 'author'
    },
    documents: [{
        type: Schema.Types.ObjectId,
        ref: 'Document'
    }]
});

export default mongoose.model<IUser>('User', UserSchema);
