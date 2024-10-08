import Docmnt from '../models/Doc.js';
import User from '../models/Usr.js';
export const getDox = async (req, res) => {
    try {
        const userid = req.params.userid;
        console.log('fetching documents for user with id: ', userid);
        if (!userid) {
            return res.status(400).json({ message: 'User userid is required' });
        }
        const dox = await Docmnt.find({ author: userid });
        if (dox.length === 0) {
            return res.status(404).json({ message: 'No documents found for this author' });
        }
        res.json(dox);
    }
    catch (error) {
        console.error('Error fetching documents:', error.message);
        res.status(500).json({ message: 'Error fetching documents', error: error.message });
    }
};
export const getDoc = async (req, res) => {
    const docid = req.params.id;
    console.log('fetching document with id: ', docid);
    try {
        const doc = await Docmnt.findOne({ _id: docid });
        if (!doc) {
            return res.status(404).json({ message: 'Document not found' });
        }
        if (doc instanceof Error) {
            console.error('Error retrieving document:', doc.message);
            return res.status(500).json({ message: 'Error fetching document' });
        }
        res.json(doc);
    }
    catch (error) {
        console.error('Unexpected error:', error.message);
        return res.status(500).json({ message: 'Error fetching document' });
    }
};
export const cr8Doc = async (req, res) => {
    try {
        const { title, content, authorId } = req.body;
        if (!title || !content || !authorId) {
            return res.status(400).json({ message: 'Missing required fields: title, content, or authorId' });
        }
        const newDocmnt = new Docmnt({
            title,
            content,
            author: authorId,
        });
        await newDocmnt.save();
        const updatedUser = await User.findByIdAndUpdate(authorId, { $push: { documents: newDocmnt._id } }, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: 'Author not found' });
        }
        res.status(201).json(newDocmnt);
    }
    catch (error) {
        console.error('Error creating document:', error);
        res.status(500).json({ message: 'Error creating document', error: error.message });
    }
};
// ####################  upd8Doc is no longer needed as it is  ####################
// ####################  handeled by websocket in docRoute.ts  ####################
// export const upd8Doc = async (req: Request, res: Response) => {
//     const docid = req.params.id
//     console.log('patching document with id: ', docid)
//     try {
//         const { title, content } = req.body
//         const doc = await Docmnt.findById(docid)
//         if (!doc) {
//             return res.status(404).json({ message: 'Document not found' })
//         }
//         doc.title = title
//         doc.content = content
//         doc.version += 0.1
//         const updoc = await doc.save()
//         res.json(updoc)
//     } catch (error: Error | any) {
//         console.error('Error updating document:', error)
//         res.status(500).json({ error })
//     }
// }
export const del8Doc = async (req, res) => {
    const docid = req.params.id;
    try {
        const doc = await Docmnt.findById(docid);
        if (!doc) {
            return res.status(404).json({ message: 'Document not found' });
        }
        await Docmnt.findByIdAndDelete(docid);
        // Remove document from user's documents array
        await User.updateMany({ documents: docid }, { $pull: { documents: docid } });
        res.json({ message: `Document with id ${docid} deleted successfully` });
    }
    catch (error) {
        console.error('Error deleting document:', error);
        res.status(500).json({ message: 'Error deleting document', error });
    }
};
const addCoAuthor = async (req, res) => {
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
    }
    catch (error) {
        console.error('Error adding co-author:', error);
        res.status(500).json({ message: 'Error adding co-author', error });
    }
};
