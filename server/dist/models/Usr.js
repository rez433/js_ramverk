import mongoose, { Schema } from 'mongoose';
const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
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
export default mongoose.model('users', UserSchema);
