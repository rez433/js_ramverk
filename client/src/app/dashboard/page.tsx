'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation';


interface Document {
    _id: string
    title: string
    author: string
    updatedAt: Date
}



export default function Dashboard() {
    const router = useRouter();
    const api = "http://localhost:5051/api"
    const [documents, setDocuments] = useState<Document[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const userid = '668cedaaa3b2e1507b0d54e3';



    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const res = await fetch(`${api}/docs/${userid}`)
                if (!res.ok) {
                    throw new Error('Failed to fetch documents')
                }
                const data = await res.json()
                const sortedDocs = await [...data].sort((a,b) => {return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()})
                setDocuments(sortedDocs)
                setIsLoading(false)
            } catch (err) {
                setError('Error fetching documents. Please try again later.')
                setIsLoading(false)
            }
        }

        fetchDocuments()
    }, [userid])


    const handleDelete = async (_id: string) => {
        try {
            const res = await fetch(`${api}/doc/delete/${_id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            if (!res.ok) {
                throw new Error('Failed to delete document');
            }

            const delConfirm = await res.json();
            toast.success('Document deleted successfully!', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });

            setDocuments((prevDocuments) =>
                prevDocuments.filter((doc) => doc._id !== _id)
            );

        } catch (error) {
            toast.error('Error deleting document. Please try again.');
            console.error('Error:', error);
        }
    }

    const fetchNewId = async () => {
        try {
            const res = await fetch(`${api}/doc/new`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: 'Untitled',
                    content: {},
                    authorId: userid,
                }),
            });

            if (!res.ok) {
                throw new Error('Failed to create a new document');
            }

            res.json().then((newDoc) => {
                if (newDoc && newDoc._id) {
                    router.push(`/editor/${newDoc._id}`)
                }
            })
             
        } catch (error) {
            setError('Error creating a new document. Please try again later.');
            console.error('Error:', error);
        }
    };

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>
    }

    if (error) {
        return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>
    }

    return (
        <div className="container mx-auto p-4">
            <div className="mt-6">
                <button onClick={fetchNewId}>Create New Document</button>
            </div>
            <h1 className="text-2xl font-bold mb-4">Your Documents</h1>

            <div className="overflow-x-auto">
                <table className="min-w-full table-auto border-collapse">
                    <thead>
                        <tr className="bg-gray-200 text-left">
                            <th className="px-6 py-4">Title</th>
                            <th className="px-6 py-4">Author</th>
                            <th className="px-6 py-4">Last Edited</th>
                            <th className="px-6 py-4"></th>
                            <th className="px-6 py-4"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {documents.map((doc) => (
                            <tr key={doc._id} className="border-b hover:bg-gray-100 transition">
                                <td className="px-6 py-4">
                                    <Link href={`/editor/${doc._id}`} className="text-blue-600 hover:underline">
                                        {doc.title}
                                    </Link>
                                </td>

                                <td className="px-6 py-4">{doc.author}</td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {new Date(doc.updatedAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4">
                                    <Link href={`/editor/${doc._id}`} className="text-blue-600 hover:underline">
                                        Edit
                                    </Link>
                                </td>
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => handleDelete(doc._id)}
                                        className="text-red-600 hover:text-red-800"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    )
}