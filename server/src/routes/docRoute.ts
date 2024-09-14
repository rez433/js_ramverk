import express from 'express'
import { getDox, getDoc, cr8Doc, upd8Doc, del8Doc } from '../controllers/docController.ts'


const router = express.Router()

// Get All Docs
router.get('/docs/:userid', getDox)

// Get one Doc
router.get('/doc/:id', getDoc)

// Post a new Doc
router.post('/doc/new', cr8Doc)

// Update a Doc
router.patch('/doc/patch/:id', upd8Doc)

// Delete a Doc
router.delete('/doc/delete/:id', del8Doc)


export default router
