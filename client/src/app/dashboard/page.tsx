'use client'

import { useAuth } from '@/app/AuthContext'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'
import io from 'socket.io-client'

const baseApiUrl: string = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || ''
const socket = io(baseApiUrl)

interface Document {
	_id: string
	title: string
	author: {
		_id: string
		name: string
		lastName: string
		email: string
		role: string
	}
	co_authors: [
		{
			_id: string
			name: string
			lastName: string
			email: string
			role: string
		}
	]
	createdAt: Date
	updatedAt: Date
}

export default function Dashboard() {
	const { isAuthenticated, user } = useAuth()
	const router = useRouter()
	const [documents, setDocuments] = useState<Document[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const fetchDocuments = async () => {
			if (!user || !isAuthenticated) {
				router.push('/signin')
				return
			}
			try {
				const res = await fetch(`${baseApiUrl}/graphql`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						query: `
						query docsQuery($id: ID!) {
							articles(authorId: $id) {
								title, content, createdAt, updatedAt, _id
								author {
									name, lastName
								}, co_authors {
									name, lastName
								}
							}
						}
						`,
						variables: {
							"id": user.id
						}
					})
				})

				if (!res.ok) {
					throw new Error('Failed to fetch documents')
				}
				const data = await res.json()
				const sortedDocs = [...data.data.articles].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
				setDocuments(sortedDocs)
				setIsLoading(false)
			}

			catch (err) {
				setError('Error fetching documents. Please try again later.')
				setIsLoading(false)
			}
		}

		fetchDocuments()

		socket.on('document_updated', (data) => {
			setDocuments(prevDocs => {
				const updatedDocs = prevDocs.map(doc =>
					doc._id === data.docId ? { ...doc, title: data.title, updatedAt: new Date() } : doc
				)
				return [...updatedDocs].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
			})
		})

		return () => {
			socket.off('document_updated')
		}
	}, [user])

	const handleDelete = async (_id: string) => {
		try {
			const res = await fetch(`${baseApiUrl}/graphql`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					query: `
						mutation del8Doc($id: ID!) {
							del8Doc(_id: $id) {
								_id
							}
						}
					`,
					variables: {
						"_id": _id
					}
				})
			})

			if (!res.ok) {
				throw new Error('Failed to delete document')
			}

			await res.json()
			toast.success('Document deleted successfully!', {
				position: 'top-right',
				autoClose: 1800,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
			})

			setDocuments((prevDocuments) =>
				prevDocuments.filter((doc) => doc._id !== _id)
			)

		} catch (error) {
			toast.error('Error deleting document. Please try again.')
			console.error('Error:', error)
		}
	}

	const fetchNewId = async () => {
		if (!user || !isAuthenticated) return

		try {
			const res = await fetch(`${baseApiUrl}/api/doc/new`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					title: 'Untitled',
					content: {},
					authorId: user.id,
				}),
			})

			if (!res.ok) {
				throw new Error('Failed to create a new document')
			}

			const newDoc = await res.json()
			if (newDoc && newDoc._id) {
				router.push(`/editor/${newDoc._id}`)
			}
		} catch (error) {
			setError('Error creating a new document. Please try again later.')
			console.error('Error:', error)
		}
	}

	if (isLoading) {
		return <div className="flex justify-center items-center h-screen">Loading...</div>
	}

	if (error) {
		return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>
	}

	return (
		<div className="container mx-auto p-4">
			<div className="my-6">
				<button className="px-4 py-2 border-solid rounded-md border-4 border-sky-500" onClick={fetchNewId}>Create New Document</button>
			</div>
			<h1 className="text-2xl font-bold mb-4">Your Documents</h1>

			<div className="overflow-x-auto">
				<table className="min-w-full table-auto border-collapse">
					<thead>
						<tr className="bg-gray-200 text-left">
							<th className="px-6 py-4">Title</th>
							<th className="px-6 py-4">Author</th>
							<th className="px-6 py-4">Co Authors</th>
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
								<td className="px-6 py-4">{doc.author.name + ' ' + doc.author.lastName}</td>
								<td className="px-6 py-4">{doc.co_authors ? doc.co_authors.map((coAuthor) => coAuthor.name + ' ' + coAuthor.lastName) : ''}</td>
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
