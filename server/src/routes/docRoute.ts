import express from 'express'
import { Server, Socket } from 'socket.io'
import Docmnt from '../models/Doc.js'

import { getDox, getDoc, cr8Doc, del8Doc } from '../controllers/docController.js'


const router = express.Router()

// Get All Docs
router.get('/docs/:userid', getDox)

// Delete a Doc
router.delete('/doc/delete/:id', del8Doc)

// Get one Doc
router.get('/doc/:id', getDoc)

// Post a new Doc
router.post('/doc/new', cr8Doc)

// Patch doc is handled by websocket
export const soket = (io: Server) => {
	io.on('connection', (socket: Socket) => {
		console.log(`A user connected with id: ${socket.id}`)

		socket.on('join_doc', async (docId: string) => {
			socket.join(docId)
			console.log(`User joined document: ${docId}`)
		})

		socket.on('leave_doc', (docId: string) => {
			socket.leave(docId)
			console.log(`User left document: ${docId}`)
		})


		socket.on('update_doc', async (data: { docId: string; content: any; title: string }) => {
			try {
				const { docId, content, title } = data
				const updatedDoc = await Docmnt.findByIdAndUpdate(docId, { content, title }, { new: true })
				if (updatedDoc) {
					io.to(docId).emit('doc_updated', { docId, content: updatedDoc.content, title: updatedDoc.title })
				}
			} catch (error) {
				console.error('Error updating document:', error)
			}
		})

		socket.on('send_changes', delta => {
			socket.broadcast.emit('get_changes', delta)
		})

		socket.on('disconnect', () => {
			console.log(`user ${socket.id} disconnected`)
		})
	})
}

export default router
