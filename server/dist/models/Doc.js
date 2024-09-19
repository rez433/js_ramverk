import mongoose, { Schema } from 'mongoose';
const DocmntSchema = new Schema({
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
export default mongoose.model('txts', DocmntSchema);
