'use client'

import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { useParams } from 'next/navigation'
import Editor from '@/components/Editor'


export default function EditorPage() {
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [qtxt, setQtxt] = useState('')
    const params = useParams()
    const docid = params.id

    useEffect(() => {
        if (docid && docid !== 'new') {

            const fetchDocument = async () => {
                try {
                    const response = await fetch(`http://localhost:5051/api/doc/${docid}`)
                    if (!response.ok) {
                        throw new Error('Failed to fetch document')
                    }

                    const data = await response.json()

                    setTitle(data.title)
                    setContent(data.content)

                    setIsLoading(false)
                } catch (err) {
                    setError('Error fetching document. Please try again later.')
                    setIsLoading(false)
                }
            }

            fetchDocument()
        } else {
            setIsLoading(true)
        }
    }, [])


    if (isLoading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>
    }


    const handlePrint = () => {
        console.log('printing: ', qtxt)
        const prntr = window.open('', '', 'width=800,height=600')

        prntr?.document.write(`
            <html>
                <head>
                    <link media="print" rel="stylesheet" href='../globals.css'>
                    <link media="print" rel="stylesheet" href='quill/dist/quill.snow.css'>
                    <link media="print" rel="stylesheet" href='../../components/editor.css'>
                    <title>
                        ${title}
                    </title>
                </head>
                <body>
                    ${qtxt}
                </body>
            </html>
        `)
    }


    const handleSave = async () => {
        console.log('saving: ', content)
        const res = await fetch(`http://localhost:5051/api/doc/patch/${docid}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                content: content,
                title: title
            })
        })

        if (!(res).ok) {
            throw new Error('Failed to delete document')
        }

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
            />
        </div>
    )
}