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

const Editor = ({ content, setContent, setQtxt, emitChanges, handleIncomingChanges }: EditorProps) => {
    const editorRef = useRef<HTMLDivElement | null>(null)
    const [quill, setQuill] = useState<Quill | null>(null)

    useEffect(() => {
        if (typeof window !== 'undefined' && editorRef.current && !quill) {
            const quil = new Quill(editorRef.current, {
                theme: 'snow',
                modules: {
                    toolbar: '#toolbar',
                }
            })
            
            if (quil.getLength() <= 1)
            {
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
        <>
            <div id="toolbar">
                <button className="ql-bold"></button>
                <button className="ql-italic"></button>
                <button className="ql-underline"></button>
                <button className="ql-link"></button>
                <button className="ql-image"></button>
                <select className="ql-header">
                    <option value=""></option>
                    <option value="1"></option>
                    <option value="2"></option>
                    <option value="3"></option>
                    <option value="4"></option>
                </select>
                <button className="ql-list" value="ordered"></button>
                <button className="ql-list" value="bullet"></button>
            </div>

            <div ref={editorRef} />
        </>
    )
}

export default Editor
