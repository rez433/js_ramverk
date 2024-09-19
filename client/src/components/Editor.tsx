'use client'

import { useEffect, useRef, useState } from 'react'
import Quill from 'quill'
import { Delta } from 'quill/core'
import 'quill/dist/quill.snow.css'
import './editor.css'

interface EditorProps {
    docid: any
    content: any
    setContent: (content: any) => void
    setQtxt: (qtxt: any) => void
    emitChanges: (delta: any) => void
    handleIncomingChanges: (handler: (txts: any) => void) => () => void
}


const toolbarOptions = [
    [{ 'header': [1, 2, 3, 4, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    ['link', 'image', 'video', 'formula'],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'list': 'check' }],
    [{ 'indent': '-1'}, { 'indent': '+1' }],
    [{ 'color': [] }, { 'background': [] }],
    ['clean']
];

const Editor = ({ content, setContent, setQtxt, emitChanges, handleIncomingChanges }: EditorProps) => {
    const editorRef = useRef<HTMLDivElement | null>(null)
    const [quill, setQuill] = useState<Quill | null>(null)

    useEffect(() => {
        if (typeof window !== 'undefined' && editorRef.current && !quill) {
            const quil = new Quill(editorRef.current, {
                theme: 'snow',
                modules: {
                    toolbar: toolbarOptions,
                }
            })

            if (quil.getLength() <= 1) {
                quil.updateContents(content)
                setQtxt(quil.root.innerHTML)
            }

            setQuill(quil)
        }
    }, [])

    useEffect(() => {
        if (quill == null) return

        const handler = (delta: Delta, oldDelta: Delta, source: string) => {
            if (source !== 'user') return

            emitChanges(delta)
            setContent(quill.getContents())
            setQtxt(quill.root.innerHTML)
        }

        quill.on('text-change', handler)

        return () => {
            quill.off('text-change', handler)
        }
    }, [quill, emitChanges, setContent, setQtxt])

    useEffect(() => {
        if (quill == null) return

        return handleIncomingChanges((txts: any) => {
            quill.updateContents(txts)
        })
    }, [quill, handleIncomingChanges])

    return (
        <div ref={editorRef} />
    )
}

export default Editor
