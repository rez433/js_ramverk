'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { toast } from 'react-toastify'
import { io, Socket } from 'socket.io-client'
import { useParams } from 'next/navigation'
import Editor from '@/components/Editor'


export default function EditorPage() {
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [socket, setSocket] = useState<Socket<any, any> | null>(null)
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [qtxt, setQtxt] = useState('')
    const params = useParams()
    const docid = params.id

    useEffect(() => {
        const fetchDocument = async () => {
            if (!docid) {
                setIsLoading(false)
                return
            }

            try {
                const response = await fetch(`http://localhost:5051/api/doc/${docid}`)
                if (!response.ok) {
                    throw new Error('Failed to fetch document')
                }

                const data = await response.json()
                setTitle(data.title)
                setContent(data.content)
            } catch (err) {
                setError('Error fetching document. Please try again later.')
            } finally {
                setIsLoading(false)
            }
        }

        // websocket setup
        const setupSocket = () => {
            const newSocket: Socket<any, any> = io('http://localhost:5051')
            setSocket(newSocket)
            return () => {
                newSocket.disconnect()
            }
        }

        fetchDocument()
        return setupSocket()
    }, [docid])


    const handlePrint = () => {
        const prntr = window.open("prntr", "status=1", 'width=800,height=600')
    
        if (prntr) {
            prntr.document.write(`
                            <html>
                                <head>
                                    <title>${title}</title>
                                    <style>
                                        img {
                                            display: block;
                                            max-width: 210mm;
                                            max-height: 297mm;
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
                                <body>
                                    <main>
                                        <div>
                                            <h1>${title}<h1>
                                        </div>
                                        <article>${qtxt}</article>
                                    </main>
                                `);
                                    
                    
            prntr.onbeforeprint = () => {
                prntr.history.replaceState({}, "", `./${title}`);
            }
            prntr.document.write('<body onafterprint="self.close()">');
            prntr.document.write(`</body></html>`)
            prntr.print();
        }
    }

    const handleSave = async () => {
        // emit the content when save button clicked
        socket?.emit('update_doc', { 'content': content, 'title': title, 'docId': docid })

        toast.success('Document saved successfully!', {
            position: 'top-right',
            autoClose: 3000,
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

    return (
        <div className="container qeditor mx-auto p-4 max-w-4xl">
            <div className='ttl-field'>
                <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter document title"
                />
                <div className='cstomBtn'>
                    <button className="prnt" onClick={handlePrint}>Print</button>
                    <button className="savebtn" onClick={handleSave}>Save</button>
                </div>
            </div>
            <Editor
                docid={docid}
                content={content}
                setContent={setContent}
                setQtxt={setQtxt}
                emitChanges={emitChanges}
                handleIncomingChanges={handleIncomingChanges}
            />
        </div>
    )
}
