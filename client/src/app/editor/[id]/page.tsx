'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { toast } from 'react-toastify'
import { io, Socket } from 'socket.io-client'
import { useParams } from 'next/navigation'
import Editor from '@/components/Editor'
import { useAuth } from '@/app/AuthContext'


interface Comment {
	content: string
	range: {
		index: number
		length: number
	}
	commenter: {
		_id: string
	}
	article: any
}

export default function EditorPage() {
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [socket, setSocket] = useState<Socket<any, any> | null>(null)
	const [title, setTitle] = useState('')
	const [content, setContent] = useState('')
	const [newCmnt, setNewCmnt] = useState({})
	const [cmnt, setCmnt] = useState([] as Comment[])
	const [qtxt, setQtxt] = useState('')
	const params = useParams()
	const docid = params.id
	const { user } = useAuth()


	const baseApiUrl: string = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || ''

	useEffect(() => {
		const fetchDocument = async () => {
			if (!docid) {
				setIsLoading(false)
				return
			}

			try {
				const response = await fetch(`${baseApiUrl}/graphql`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						query: `
							query Article($articleId: ID!) {
								article(articleId: $articleId) {
									title
									content
									author {
										name
										lastName
									}
									co_authors {
										name
										lastName
									}
									createdAt
									updatedAt
									comments {
										_id
										commenter {
											name
											lastName
										}
										content
										range
										createdAt				
									}
								}
							}
						`,
						variables: { articleId: docid },
					}),
				})
				if (!response.ok) {
					throw new Error('Failed to fetch document')
				}

				console.log('user is: ', user)
				const d = await response.json()
				const data = d.data.article
				setTitle(data.title)
				setContent(data.content)
				setCmnt(data.comments)
				console.log(data)
			} catch (err) {
				setError('Error fetching document. Please try again later.')
			} finally {
				setIsLoading(false)
			}
		}

		// websocket setup
		const setupSocket = () => {
			const newSocket: Socket<any, any> = io(baseApiUrl)
			setSocket(newSocket)
			return () => {
				newSocket.disconnect()
			}
		}

		fetchDocument()
		return setupSocket()
	}, [docid, baseApiUrl])


	const handlePrint = () => {
		const prntr = window.window.open('', '')

		if (prntr) {
			prntr.document.write(
				`
				<!DOCTYPE html>
				<head>
					<title>${title}</title>
					<style>
						img {
							display: block;
							max-width: 160mm;
							max-height: 220mm;
							width: auto;
							height: auto;
						}
						@page {
							margin: 1in;
							size: 210mm 297mm;
							padding: 24mm 16mm 16mm 16mm;
						}
						@media print {
							table {
								page-break-inside: avoid;
							}
							a[href]:after {
								content: " (" attr(href) ")";
								font-size: 90%;
								color: #333;
							}
						}
					</style>
				</head>
				<body onbeforeprint="self.history.pushState({}, '', './${title}')" onafterprint="self.close()">
					<main>
						<div>
							<h1>${title}<h1>
						</div>
						<article>${qtxt}</article>
					</main>
				</body>
				</html>
			`)
			prntr.print()
		}

		toast.success('Document printed successfully!', {
			position: 'top-right',
			autoClose: 1800,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
		})
	}

	const handleCod = () => {
		setQtxt(content)
	}

	const handleSave = async () => {
		// emit the content when save button clicked
		socket?.emit('update_doc', { 'content': content, 'title': title, 'docId': docid })

		toast.success('Document saved successfully!', {
			position: 'top-right',
			autoClose: 1800,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
		})
	}

	const emitChanges = useCallback((delta: any) => {
		socket?.emit('send_changes', delta)
	}, [socket])

	const handleIncomingChanges = useCallback((handler: (txts: any) => void) => {
		socket?.on('get_changes', handler)
		return () => {
			socket?.off('get_changes', handler)
		}
	}, [socket])

	if (isLoading) {
		return <div className="flex justify-center items-center h-screen">Loading...</div>
	}

	if (error) {
		return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>
	}

	if (newCmnt) {
		console.log('new comment is ', newCmnt)

		const newComment = {
			content: newCmnt.content,
			commenter: user.id,
			article: docid,
			range: newCmnt.range
		}

		if (socket) {
			socket.emit('send_new_comment', newComment)
			setNewCmnt(null)
		}
	}


	return (
		<div>
			<div className='ttl-field mb-1'>
				<input
					type="text"
					id="title"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					placeholder="Enter document title"
				/>
				<div className='cstomBtn'>
					<button className="codbtn" onClick={handleCod}>Code</button>
					<button className="prnt" onClick={handlePrint}>Print</button>
					<button className="savebtn" onClick={handleSave}>Save</button>
				</div>
			</div>
			<Editor
				docid={docid}
				content={content}
				setContent={setContent}
				setQtxt={setQtxt}
				setNewCmnt={setNewCmnt}
				emitChanges={emitChanges}
				handleIncomingChanges={handleIncomingChanges}
				cmnt={cmnt}
				setCmnt={setCmnt}
			/>
		</div>
	)
}
