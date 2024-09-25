import mongoose, { Schema, Document } from 'mongoose'
import { IDocmnt } from './Doc.js'

export interface IUser {
	_id: string;
	email: string;
	password_hash: string;
	name: string;
	lastName: string;
	role: string;
	documents: IDocmnt[];
}

const UserSchema: Schema = new Schema({
	name: {
		type: String,
		required: true
	},
	lastName: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true,
		unique: true
	},
	password_hash: {
		type: String,
		required: true
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
})

export default mongoose.model<IUser>('users', UserSchema)
