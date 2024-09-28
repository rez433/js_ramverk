import mongoose, { Schema, Document } from 'mongoose'
import {IWriter} from './writer.js'


export interface IArticle extends Document {
	title: string
	content: string
	author: IWriter
	co_authors: IWriter[]
	createdAt: Date
	updatedAt: Date
	version: number
}

const ArticleSchema: Schema = new Schema({
	title: {
		type: String,
		required: true
	},
	content: {
		type: Object,
	},
	author: {
		type: Schema.Types.ObjectId,
		ref: 'writer',
		required: true
	},
	co_authors: [{
		type: Schema.Types.ObjectId,
		ref: 'writer'
	}],
	version: {
		type: Number,
		default: 1
	}
}, { timestamps: true })


export default mongoose.model<IArticle>('article', ArticleSchema)
