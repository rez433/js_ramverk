import { Request, Response } from 'express';
import Docmnt, { IDocmnt } from '../models/Doc';
import User from '../models/Usr';

const getDox = async (req: Request, res: Response) => {
    try {
        const dox = await Docmnt.find().populate('author', 'name');
        res.json(dox);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching documents', error });
    }
};

const getDoc = async (req: Request, res: Response) => {
    try {
        const doc = await Docmnt.findById(req.params.id).populate('author', 'name');
        if (!doc) {
            return res.status(404).json({ message: 'Document not found' });
        }
        res.json(document);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching document', error });
    }
};

const cr8Doc = async (req: Request, res: Response) => {
    try {
        const { title, content, authorId } = req.body;
        const newDocmnt = new Docmnt({
            title,
            content,
            author: authorId,
        });
        await newDocmnt.save();

        await User.findByIdAndUpdate(authorId, { $push: { documents: newDocmnt._id } });

        res.status(201).json(newDocmnt);
    } catch (error) {
        res.status(500).json({ message: 'Error creating document', error });
    }
};

const upd8Doc = async (req: Request, res: Response) => {
    try {
        const { title, content, version } = req.body;
        const doc = await Docmnt.findById(req.params.id);

        if (!doc) {
            return res.status(404).json({ message: 'Document not found' });
        }

        if (doc.version !== version) {
            return res.status(409).json({ message: 'Document version conflict' });
        }

        doc.title = title;
        doc.content = content;
        doc.version += 1;

        await doc.save();
        res.json(document);
    } catch (error) {
        res.status(500).json({ message: 'Error updating document', error });
    }
};

const del8Doc = async (req: Request, res: Response) => {
    try {
        const doc = await Docmnt.findById(req.params.id);

        if (!doc) {
            return res.status(404).json({ message: 'Document not found' });
        }

        await Docmnt.findByIdAndDelete(req.params.id);

        // Remove document from user's documents array
        await User.updateMany(
            { documents: req.params.id },
            { $pull: { documents: req.params.id } }
        );

        res.json({ message: 'Document deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting document', error });
    }
};

const addCoAuthor = async (req: Request, res: Response) => {
    try {
        const { docId, coAuthorId } = req.body;
        const doc = await Docmnt.findById(docId);
        const coAuthor = await User.findById(coAuthorId);

        if (!doc || !coAuthor) {
            return res.status(404).json({ message: 'Document or user not found' });
        }

        if (doc.co_authors.includes(coAuthorId)) {
            return res.status(400).json({ message: 'User is already a co-author' });
        }

        doc.co_authors.push(coAuthorId);
        await doc.save();

        coAuthor.documents.push(docId);
        await coAuthor.save();

        res.json({ message: 'Co-author added successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error adding co-author', error });
    }
};

module.exports = {
    getDox,
    getDoc,
    cr8Doc,
    del8Doc,
    upd8Doc,
    addCoAuthor
}